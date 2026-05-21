import { prisma } from "../../prisma/client.js";
import { hashPassword } from "../../shared/utils/hash.js";
import { AppError, ConflictError, NotFoundError } from "../../shared/errors/AppError.js";
import { CreateUserDTO, UpdateUserDTO } from "./users.schemas.js";

function parseDate(value?: string) {
  return value ? new Date(value) : undefined;
}

function mapRhData(dto: Partial<CreateUserDTO & UpdateUserDTO>) {
  return {
    codigoServico: dto.codigoServico,
    sobrenome: dto.sobrenome,
    fotoUrl: dto.fotoUrl,
    cpf: dto.cpf,
    salarioBruto: dto.salarioBruto,
    dataAdmissao: parseDate(dto.dataAdmissao),
    dataDemissao: parseDate(dto.dataDemissao),
    motivoDemissao: dto.motivoDemissao,
    feriasInicio: parseDate(dto.feriasInicio),
    feriasFim: parseDate(dto.feriasFim),
    cnh: dto.cnh,
    cnhValidade: parseDate(dto.cnhValidade),
    diaCicloMenstrual: dto.diaCicloMenstrual,
    gestante: dto.gestante,
    dataPrevisaoParto: parseDate(dto.dataPrevisaoParto),
    acidente: dto.acidente,
    acidenteData: parseDate(dto.acidenteData),
    acidenteDescricao: dto.acidenteDescricao,
    avisoPrevio: dto.avisoPrevio,
    avisoPrevioInicio: parseDate(dto.avisoPrevioInicio),
    avisoPrevioFim: parseDate(dto.avisoPrevioFim),
    statusRh: dto.statusRh as any,
  };
}

const userSelect = {
  id: true,
  codigoServico: true,
  nome: true,
  sobrenome: true,
  email: true,
  role: true,
  telefone: true,
  fotoUrl: true,
  cpf: true,
  salarioBruto: true,
  dataAdmissao: true,
  dataDemissao: true,
  motivoDemissao: true,
  feriasInicio: true,
  feriasFim: true,
  cnh: true,
  cnhValidade: true,
  diaCicloMenstrual: true,
  gestante: true,
  dataPrevisaoParto: true,
  acidente: true,
  acidenteData: true,
  acidenteDescricao: true,
  avisoPrevio: true,
  avisoPrevioInicio: true,
  avisoPrevioFim: true,
  statusRh: true,
  ativo: true,
  createdAt: true,
};

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
          { codigoServico: { contains: q } },
        ],
      }),
    };

    const [data, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: userSelect,
        orderBy: { nome: "asc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return { data, meta: { total, page, limit } };
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
    if (!user) throw new NotFoundError("Usuário");
    return user;
  }

  async lookupByCodigo(codigo: string) {
    const user = await prisma.user.findFirst({
      where: { codigoServico: codigo, ativo: true, role: { in: ["ATENDENTE", "MECANICO"] } },
      select: {
        id: true,
        codigoServico: true,
        nome: true,
        sobrenome: true,
        role: true,
        fotoUrl: true,
      },
    });
    if (!user) throw new NotFoundError("Funcionário com este código");
    return user;
  }

  async create(dto: CreateUserDTO) {
    if (dto.codigoServico) {
      const exists = await prisma.user.findUnique({ where: { codigoServico: dto.codigoServico } });
      if (exists) throw new ConflictError("Código de serviço já cadastrado");
    }

    const senhaHash = await hashPassword(dto.senha);
    return prisma.user.create({
      data: {
        nome: dto.nome.trim(),
        email: dto.email.toLowerCase().trim(),
        senhaHash,
        role: dto.role as any,
        telefone: dto.telefone,
        ...mapRhData(dto),
      },
      select: userSelect,
    });
  }

  async update(id: string, dto: UpdateUserDTO) {
    await this.findById(id);
    if (dto.codigoServico) {
      const exists = await prisma.user.findFirst({
        where: { codigoServico: dto.codigoServico, NOT: { id } },
      });
      if (exists) throw new ConflictError("Código de serviço já cadastrado");
    }

    return prisma.user.update({
      where: { id },
      data: {
        nome: dto.nome?.trim(),
        telefone: dto.telefone,
        ativo: dto.ativo,
        ...mapRhData(dto),
      },
      select: userSelect,
    });
  }

  async deactivate(id: string) {
    const user = await this.findById(id);
    if (user.role === "PROPRIETARIO") {
      throw new AppError("Não é possível desativar o proprietário", 422);
    }
    await prisma.user.update({ where: { id }, data: { ativo: false } });
  }
}

export const usersService = new UsersService();
