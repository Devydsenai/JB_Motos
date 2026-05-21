import { prisma } from "../../prisma/client.js";
import { hashPassword } from "../../shared/utils/hash.js";
import { AppError, NotFoundError } from "../../shared/errors/AppError.js";
import { CreateUserDTO, UpdateUserDTO } from "./users.schemas.js";

export class UsersService {
  async list(query: { page: number; limit: number; role?: string; ativo?: boolean; q?: string }) {
    const { page, limit, role, ativo, q } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(role && { role: role as any }),
      ...(ativo !== undefined && { ativo }),
      ...(q && {
        OR: [
          { nome: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
        ],
      }),
    };

    const [data, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: { id: true, nome: true, email: true, role: true, telefone: true, ativo: true, createdAt: true },
        orderBy: { nome: "asc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { data, meta: { total, page, limit } };
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, nome: true, email: true, role: true, telefone: true, ativo: true, createdAt: true },
    });
    if (!user) throw new NotFoundError("Usuário");
    return user;
  }

  async create(dto: CreateUserDTO) {
    const senhaHash = await hashPassword(dto.senha);
    return prisma.user.create({
      data: {
        nome: dto.nome.trim(),
        email: dto.email.toLowerCase().trim(),
        senhaHash,
        role: dto.role as any,
        telefone: dto.telefone,
      },
      select: { id: true, nome: true, email: true, role: true, telefone: true, createdAt: true },
    });
  }

  async update(id: string, dto: UpdateUserDTO) {
    await this.findById(id);
    return prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, nome: true, email: true, role: true, telefone: true, ativo: true },
    });
  }

  async deactivate(id: string) {
    await this.findById(id);
    await prisma.user.update({ where: { id }, data: { ativo: false } });
  }
}

export const usersService = new UsersService();
