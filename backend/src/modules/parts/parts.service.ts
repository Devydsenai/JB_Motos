import { prisma } from "../../prisma/client.js";
import { AppError, NotFoundError } from "../../shared/errors/AppError.js";
import { Decimal } from "../../shared/utils/decimal.js";
import { CreatePartDTO, UpdatePartDTO } from "./parts.schemas.js";

export class PartsService {
  async listByOS(serviceOrderId: string) {
    const os = await prisma.serviceOrder.findUnique({ where: { id: serviceOrderId } });
    if (!os) throw new NotFoundError("Ordem de Serviço");

    return prisma.part.findMany({
      where: { serviceOrderId },
      orderBy: { createdAt: "asc" },
    });
  }

  async create(dto: CreatePartDTO) {
    const os = await prisma.serviceOrder.findUnique({
      where: { id: dto.serviceOrderId },
    });
    if (!os) throw new NotFoundError("Ordem de Serviço");

    if (["FINALIZADA", "CANCELADA"].includes(os.status)) {
      throw new AppError("Não é possível adicionar peças em uma OS finalizada ou cancelada", 422);
    }

    const valorTotal = new Decimal(dto.quantidade).times(dto.valorUnitario);

    return prisma.$transaction(async (tx) => {
      const part = await tx.part.create({
        data: {
          serviceOrderId: dto.serviceOrderId,
          descricao: dto.descricao,
          quantidade: new Decimal(dto.quantidade),
          valorUnitario: new Decimal(dto.valorUnitario),
          valorTotal,
        },
      });

      // Recalcula valorPecas e valorFinal na OS
      const partsSum = await tx.part.aggregate({
        where: { serviceOrderId: dto.serviceOrderId },
        _sum: { valorTotal: true },
      });

      const newValorPecas = partsSum._sum.valorTotal ?? new Decimal(0);
      const valorFinal = new Decimal(os.valorMaoObra).plus(newValorPecas).minus(os.desconto);

      await tx.serviceOrder.update({
        where: { id: dto.serviceOrderId },
        data: { valorPecas: newValorPecas, valorFinal },
      });

      return part;
    });
  }

  async update(id: string, dto: UpdatePartDTO) {
    const part = await prisma.part.findUnique({
      where: { id },
      include: { serviceOrder: true },
    });
    if (!part) throw new NotFoundError("Peça");

    if (["FINALIZADA", "CANCELADA"].includes(part.serviceOrder.status)) {
      throw new AppError("Não é possível editar peças em uma OS finalizada ou cancelada", 422);
    }

    const novaQtd = dto.quantidade !== undefined ? new Decimal(dto.quantidade) : part.quantidade;
    const novoValor = dto.valorUnitario !== undefined ? new Decimal(dto.valorUnitario) : part.valorUnitario;
    const novoTotal = novaQtd.times(novoValor);

    return prisma.$transaction(async (tx) => {
      const updated = await tx.part.update({
        where: { id },
        data: {
          descricao: dto.descricao,
          quantidade: novaQtd,
          valorUnitario: novoValor,
          valorTotal: novoTotal,
        },
      });

      const partsSum = await tx.part.aggregate({
        where: { serviceOrderId: part.serviceOrderId },
        _sum: { valorTotal: true },
      });

      const newValorPecas = partsSum._sum.valorTotal ?? new Decimal(0);
      const valorFinal = new Decimal(part.serviceOrder.valorMaoObra)
        .plus(newValorPecas)
        .minus(part.serviceOrder.desconto);

      await tx.serviceOrder.update({
        where: { id: part.serviceOrderId },
        data: { valorPecas: newValorPecas, valorFinal },
      });

      return updated;
    });
  }

  async remove(id: string) {
    const part = await prisma.part.findUnique({
      where: { id },
      include: { serviceOrder: true },
    });
    if (!part) throw new NotFoundError("Peça");

    if (["FINALIZADA", "CANCELADA"].includes(part.serviceOrder.status)) {
      throw new AppError("Não é possível remover peças de uma OS finalizada ou cancelada", 422);
    }

    return prisma.$transaction(async (tx) => {
      await tx.part.delete({ where: { id } });

      const partsSum = await tx.part.aggregate({
        where: { serviceOrderId: part.serviceOrderId },
        _sum: { valorTotal: true },
      });

      const newValorPecas = partsSum._sum.valorTotal ?? new Decimal(0);
      const valorFinal = new Decimal(part.serviceOrder.valorMaoObra)
        .plus(newValorPecas)
        .minus(part.serviceOrder.desconto);

      await tx.serviceOrder.update({
        where: { id: part.serviceOrderId },
        data: { valorPecas: newValorPecas, valorFinal },
      });
    });
  }
}

export const partsService = new PartsService();
