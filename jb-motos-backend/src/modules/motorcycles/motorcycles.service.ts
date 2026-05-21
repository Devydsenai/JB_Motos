import { prisma } from "../../prisma/client.js";
import { NotFoundError } from "../../shared/errors/AppError.js";
import { CreateMotorcycleDTO, UpdateMotorcycleDTO } from "./motorcycles.schemas.js";

export class MotorcyclesService {
  async list(query: { page: number; limit: number; clienteId?: string; q?: string }) {
    const { page, limit, clienteId, q } = query;
    const skip = (page - 1) * limit;

    const where = {
      ativo: true,
      ...(clienteId && { clienteId }),
      ...(q && {
        OR: [
          { placa: { contains: q, mode: "insensitive" as const } },
          { modelo: { contains: q, mode: "insensitive" as const } },
          { marca: { contains: q, mode: "insensitive" as const } },
        ],
      }),
    };

    const [data, total] = await prisma.$transaction([
      prisma.motorcycle.findMany({
        where,
        include: {
          client: { select: { id: true, nome: true, telefone: true } },
          _count: { select: { serviceOrders: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.motorcycle.count({ where }),
    ]);

    return { data, meta: { total, page, limit } };
  }

  async findById(id: string) {
    const moto = await prisma.motorcycle.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, nome: true, telefone: true, email: true } },
        serviceOrders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true, numero: true, status: true, descricaoProblema: true,
            valorFinal: true, createdAt: true, dataFinalizacao: true,
          },
        },
      },
    });
    if (!moto) throw new NotFoundError("Motocicleta");
    return moto;
  }

  async create(dto: CreateMotorcycleDTO) {
    // Verifica se o cliente existe
    const client = await prisma.client.findUnique({ where: { id: dto.clienteId } });
    if (!client) throw new NotFoundError("Cliente");

    return prisma.motorcycle.create({
      data: {
        placa: dto.placa.toUpperCase(),
        marca: dto.marca,
        modelo: dto.modelo,
        ano: dto.ano,
        cor: dto.cor,
        kmAtual: dto.kmAtual,
        observacoes: dto.observacoes,
        clienteId: dto.clienteId,
      },
      include: { client: { select: { id: true, nome: true } } },
    });
  }

  async update(id: string, dto: UpdateMotorcycleDTO) {
    await this.findById(id);
    return prisma.motorcycle.update({
      where: { id },
      data: dto,
    });
  }

  async softDelete(id: string) {
    await this.findById(id);
    await prisma.motorcycle.update({ where: { id }, data: { ativo: false } });
  }
}

export const motorcyclesService = new MotorcyclesService();
