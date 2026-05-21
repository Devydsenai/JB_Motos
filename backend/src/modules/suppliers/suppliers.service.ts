import { prisma } from "../../prisma/client.js";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError.js";
import { CreateSupplierDTO, UpdateSupplierDTO } from "./suppliers.schemas.js";

export class SuppliersService {
  async list(query: { page: number; limit: number; q?: string; status?: string }) {
    const { page, limit, q, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(status && { status }),
      ...(q && {
        OR: [
          { nome: { contains: q, mode: "insensitive" } },
          { codigo: { contains: q, mode: "insensitive" } },
          { cnpj: { contains: q } },
        ],
      }),
    };

    const [data, total] = await prisma.$transaction([
      prisma.supplier.findMany({
        where,
        include: { _count: { select: { products: true } } },
        orderBy: { nome: "asc" },
        skip,
        take: limit,
      }),
      prisma.supplier.count({ where }),
    ]);

    return {
      data: data.map((s) => ({
        ...s,
        qtdProdutos: s._count.products,
        _count: undefined,
      })),
      meta: { total, page, limit },
    };
  }

  async findById(id: string) {
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!supplier) throw new NotFoundError("Fornecedor");
    return { ...supplier, qtdProdutos: supplier._count.products };
  }

  async create(dto: CreateSupplierDTO) {
    const exists = await prisma.supplier.findUnique({ where: { codigo: dto.codigo } });
    if (exists) throw new ConflictError("Código de fornecedor já cadastrado");

    return prisma.supplier.create({
      data: {
        codigo: dto.codigo.trim(),
        nome: dto.nome.trim(),
        cnpj: dto.cnpj || null,
        tipo: dto.tipo,
        categoria: dto.categoria,
        fornecedorDesde: dto.fornecedorDesde ? new Date(dto.fornecedorDesde) : null,
        contato: dto.contato,
        email: dto.email || null,
        telefone: dto.telefone,
        endereco: dto.endereco,
        cidade: dto.cidade,
        estado: dto.estado,
        condicoesPagamento: dto.condicoesPagamento,
        condicoesPagamento2: dto.condicoesPagamento2,
        observacoes: dto.observacoes,
        status: (dto.status as any) ?? "PENDENTE",
        documentoNome: dto.documentoNome,
      },
    });
  }

  async update(id: string, dto: UpdateSupplierDTO) {
    await this.findById(id);
    return prisma.supplier.update({
      where: { id },
      data: {
        codigo: dto.codigo?.trim(),
        nome: dto.nome?.trim(),
        cnpj: dto.cnpj,
        tipo: dto.tipo,
        categoria: dto.categoria,
        fornecedorDesde: dto.fornecedorDesde ? new Date(dto.fornecedorDesde) : undefined,
        contato: dto.contato,
        email: dto.email || undefined,
        telefone: dto.telefone,
        endereco: dto.endereco,
        cidade: dto.cidade,
        estado: dto.estado,
        condicoesPagamento: dto.condicoesPagamento,
        condicoesPagamento2: dto.condicoesPagamento2,
        observacoes: dto.observacoes,
        status: dto.status as any,
        documentoNome: dto.documentoNome,
        ativo: dto.status === "INATIVO" ? false : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    await prisma.supplier.update({ where: { id }, data: { ativo: false, status: "INATIVO" } });
  }
}

export const suppliersService = new SuppliersService();
