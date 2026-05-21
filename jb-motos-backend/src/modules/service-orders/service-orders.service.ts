import { prisma } from "../../prisma/client.js";
import { AppError, NotFoundError, ForbiddenError } from "../../shared/errors/AppError.js";
import { StatusOS, Role } from "../../../generated/prisma/client.js";
import { Decimal } from "../../../generated/prisma/client/runtime/library.js";
import {
  CreateServiceOrderDTO,
  UpdateStatusDTO,
  UpdateServiceOrderDTO,
} from "./service-orders.schemas.js";

// Transições de status permitidas por role
const TRANSITIONS: Record<StatusOS, StatusOS[]> = {
  ABERTA: ["EM_ANALISE", "CANCELADA"],
  EM_ANALISE: ["AGUARDANDO_PECA", "EM_EXECUCAO", "CANCELADA"],
  AGUARDANDO_PECA: ["EM_EXECUCAO", "CANCELADA"],
  EM_EXECUCAO: ["FINALIZADA", "AGUARDANDO_PECA"],
  FINALIZADA: [],
  CANCELADA: [],
};

export class ServiceOrdersService {
  async list(query: {
    page: number; limit: number; status?: string;
    mecanicoId?: string; q?: string; dataInicio?: string; dataFim?: string;
  }) {
    const { page, limit, status, mecanicoId, q, dataInicio, dataFim } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (mecanicoId) where.mecanicoId = mecanicoId;
    if (dataInicio || dataFim) {
      where.createdAt = {
        ...(dataInicio && { gte: new Date(dataInicio) }),
        ...(dataFim && { lte: new Date(dataFim) }),
      };
    }
    if (q) {
      where.OR = [
        { descricaoProblema: { contains: q, mode: "insensitive" } },
        { motorcycle: { placa: { contains: q, mode: "insensitive" } } },
        { motorcycle: { client: { nome: { contains: q, mode: "insensitive" } } } },
      ];
    }

    const [data, total] = await prisma.$transaction([
      prisma.serviceOrder.findMany({
        where,
        include: {
          motorcycle: {
            include: { client: { select: { id: true, nome: true, telefone: true } } },
          },
          mecanico: { select: { id: true, nome: true } },
          atendente: { select: { id: true, nome: true } },
          _count: { select: { parts: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.serviceOrder.count({ where }),
    ]);

    return { data, meta: { total, page, limit } };
  }

  async findById(id: string) {
    const os = await prisma.serviceOrder.findUnique({
      where: { id },
      include: {
        motorcycle: {
          include: { client: true },
        },
        mecanico: { select: { id: true, nome: true, telefone: true } },
        atendente: { select: { id: true, nome: true } },
        parts: { orderBy: { createdAt: "asc" } },
        history: {
          include: { user: { select: { id: true, nome: true, role: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!os) throw new NotFoundError("Ordem de Serviço");
    return os;
  }

  async create(dto: CreateServiceOrderDTO, atendenteId: string) {
    // Regra: motocicleta deve existir
    const moto = await prisma.motorcycle.findUnique({
      where: { id: dto.motocicletaId },
      include: { client: true },
    });
    if (!moto) throw new NotFoundError("Motocicleta");
    if (!moto.ativo) throw new AppError("Motocicleta inativa", 400);

    return prisma.$transaction(async (tx) => {
      const os = await tx.serviceOrder.create({
        data: {
          motocicletaId: dto.motocicletaId,
          atendenteId,
          mecanicoId: dto.mecanicoId,
          descricaoProblema: dto.descricaoProblema,
          observacoes: dto.observacoes,
          kmEntrada: dto.kmEntrada,
          previsaoEntrega: dto.previsaoEntrega ? new Date(dto.previsaoEntrega) : null,
          valorMaoObra: new Decimal(dto.valorMaoObra ?? 0),
          status: "ABERTA",
        },
        include: {
          motorcycle: { include: { client: { select: { id: true, nome: true } } } },
          atendente: { select: { id: true, nome: true } },
        },
      });

      // Registra histórico inicial
      await tx.oSHistory.create({
        data: {
          serviceOrderId: os.id,
          userId: atendenteId,
          statusAnterior: null,
          statusNovo: "ABERTA",
          observacao: "Ordem de Serviço aberta",
        },
      });

      return os;
    });
  }

  async updateStatus(id: string, dto: UpdateStatusDTO, userId: string, userRole: Role) {
    const os = await this.findById(id);

    // Valida transição de status
    const allowed = TRANSITIONS[os.status as StatusOS];
    if (!allowed.includes(dto.status as StatusOS)) {
      throw new AppError(
        `Transição de status inválida: ${os.status} → ${dto.status}`,
        422
      );
    }

    // Regra: somente FINALIZADA pode ser definida por MECANICO ou ATENDENTE
    if (dto.status === "FINALIZADA") {
      if (Number(os.valorMaoObra) === 0 && Number(os.valorPecas) === 0) {
        throw new AppError("Informe o valor da mão de obra ou adicione peças antes de finalizar", 422);
      }
    }

    return prisma.$transaction(async (tx) => {
      const updated = await tx.serviceOrder.update({
        where: { id },
        data: {
          status: dto.status as StatusOS,
          ...(dto.status === "FINALIZADA" && { dataFinalizacao: new Date() }),
        },
      });

      await tx.oSHistory.create({
        data: {
          serviceOrderId: id,
          userId,
          statusAnterior: os.status as StatusOS,
          statusNovo: dto.status as StatusOS,
          observacao: dto.observacao,
        },
      });

      return updated;
    });
  }

  async update(id: string, dto: UpdateServiceOrderDTO, userRole: Role) {
    const os = await this.findById(id);

    if (["FINALIZADA", "CANCELADA"].includes(os.status)) {
      throw new AppError("Não é possível editar uma OS finalizada ou cancelada", 422);
    }

    // Recalcula valor final
    const valorMaoObra = dto.valorMaoObra !== undefined
      ? new Decimal(dto.valorMaoObra)
      : os.valorMaoObra;
    const desconto = dto.desconto !== undefined
      ? new Decimal(dto.desconto)
      : os.desconto;
    const valorFinal = new Decimal(os.valorPecas).plus(valorMaoObra).minus(desconto);

    return prisma.serviceOrder.update({
      where: { id },
      data: {
        mecanicoId: dto.mecanicoId,
        observacoes: dto.observacoes,
        observacoesTecnicas: dto.observacoesTecnicas,
        previsaoEntrega: dto.previsaoEntrega ? new Date(dto.previsaoEntrega) : undefined,
        valorMaoObra,
        desconto,
        valorFinal,
      },
    });
  }

  async getDashboard() {
    const [statusCount, faturamento, faturamentoMes, topMecanicos] = await prisma.$transaction([
      prisma.serviceOrder.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.serviceOrder.aggregate({
        where: { status: "FINALIZADA" },
        _sum: { valorFinal: true },
      }),
      prisma.serviceOrder.aggregate({
        where: {
          status: "FINALIZADA",
          dataFinalizacao: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { valorFinal: true },
        _count: { id: true },
      }),
      prisma.serviceOrder.groupBy({
        by: ["mecanicoId"],
        where: {
          mecanicoId: { not: null },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ]);

    const statusMap = Object.fromEntries(
      statusCount.map((s) => [s.status, s._count.id])
    );

    return {
      status: {
        aberta: statusMap.ABERTA ?? 0,
        emAnalise: statusMap.EM_ANALISE ?? 0,
        aguardandoPeca: statusMap.AGUARDANDO_PECA ?? 0,
        emExecucao: statusMap.EM_EXECUCAO ?? 0,
        finalizada: statusMap.FINALIZADA ?? 0,
        cancelada: statusMap.CANCELADA ?? 0,
      },
      faturamento: {
        total: faturamento._sum.valorFinal ?? 0,
        mes: faturamentoMes._sum.valorFinal ?? 0,
        concluidasMes: faturamentoMes._count.id,
      },
      topMecanicos,
    };
  }
}

export const serviceOrdersService = new ServiceOrdersService();
