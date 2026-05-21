import { prisma } from "../../prisma/client.js";
import { AppError, ConflictError, NotFoundError } from "../../shared/errors/AppError.js";
import { CreateClientDTO, UpdateClientDTO } from "./clients.schemas.js";

export class ClientsService {
  async list(query: { page: number; limit: number; q?: string; ativo: boolean }) {
    const { page, limit, q, ativo } = query;
    const skip = (page - 1) * limit;

    const where = {
      ativo,
      ...(q && {
        OR: [
          { nome: { contains: q, mode: "insensitive" as const } },
          { telefone: { contains: q } },
          { cpf: { contains: q } },
        ],
      }),
    };

    const [data, total] = await prisma.$transaction([
      prisma.client.findMany({
        where,
        include: {
          _count: { select: { motorcycles: true } },
        },
        orderBy: { nome: "asc" },
        skip,
        take: limit,
      }),
      prisma.client.count({ where }),
    ]);

    return { data, meta: { total, page, limit } };
  }

  async findById(id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        motorcycles: {
          where: { ativo: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!client) throw new NotFoundError("Cliente");
    return client;
  }

  async create(dto: CreateClientDTO) {
    // Regra de negócio: telefone único
    const existing = await prisma.client.findUnique({
      where: { telefone: dto.telefone },
    });
    if (existing) throw new ConflictError("Telefone já cadastrado para outro cliente");

    return prisma.client.create({
      data: {
        nome: dto.nome.trim(),
        telefone: dto.telefone,
        cpf: dto.cpf || null,
        email: dto.email || null,
        endereco: dto.endereco || null,
        cidade: dto.cidade || null,
        observacoes: dto.observacoes || null,
      },
    });
  }

  async update(id: string, dto: UpdateClientDTO) {
    await this.findById(id);

    // Se atualizar telefone, verificar duplicidade
    if (dto.telefone) {
      const conflict = await prisma.client.findFirst({
        where: { telefone: dto.telefone, id: { not: id } },
      });
      if (conflict) throw new ConflictError("Telefone já cadastrado para outro cliente");
    }

    return prisma.client.update({
      where: { id },
      data: {
        nome: dto.nome,
        telefone: dto.telefone,
        cpf: dto.cpf,
        email: dto.email || null,
        endereco: dto.endereco,
        cidade: dto.cidade,
        observacoes: dto.observacoes,
      },
    });
  }

  async softDelete(id: string) {
    // Verifica OS ativa
    const osAtiva = await prisma.serviceOrder.findFirst({
      where: {
        motorcycle: { clienteId: id },
        status: { notIn: ["FINALIZADA", "CANCELADA"] },
      },
    });
    if (osAtiva) {
      throw new AppError("Cliente possui ordens de serviço em andamento", 409);
    }

    await prisma.client.update({ where: { id }, data: { ativo: false } });
  }

  async getHistory(id: string) {
    await this.findById(id);
    return prisma.serviceOrder.findMany({
      where: { motorcycle: { clienteId: id } },
      include: {
        motorcycle: { select: { placa: true, marca: true, modelo: true } },
        mecanico: { select: { nome: true } },
        parts: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const clientsService = new ClientsService();
