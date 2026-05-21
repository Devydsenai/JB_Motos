import { Decimal } from "../../shared/utils/decimal.js";
import { prisma } from "../../prisma/client.js";
import { ConflictError, NotFoundError } from "../../shared/errors/AppError.js";
import { CreateProductDTO, UpdateProductDTO } from "./products.schemas.js";

export class ProductsService {
  async list(query: {
    page: number;
    limit: number;
    q?: string;
    categoria?: string;
    visivelLoja?: boolean;
    ativo?: boolean;
    marca?: string;
    estoqueBaixo?: boolean;
  }) {
    const { page, limit, q, categoria, visivelLoja, ativo, marca, estoqueBaixo } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(categoria && { categoria }),
      ...(visivelLoja !== undefined && { visivelLoja }),
      ...(ativo !== undefined && { ativo }),
      ...(marca && { marcasCompativel: { has: marca } }),
      ...(q && {
        OR: [
          { nome: { contains: q, mode: "insensitive" } },
          { codigo: { contains: q, mode: "insensitive" } },
          { descricao: { contains: q, mode: "insensitive" } },
        ],
      }),
    };

    let data = await prisma.product.findMany({
      where,
      include: { supplier: { select: { id: true, nome: true, codigo: true } } },
      orderBy: { nome: "asc" },
      skip,
      take: limit,
    });

    if (estoqueBaixo) {
      data = data.filter(
        (p) => Number(p.quantidade) <= Number(p.quantidadeMinima) && Number(p.quantidadeMinima) > 0,
      );
    }

    const total = await prisma.product.count({ where });
    return { data, meta: { total, page, limit } };
  }

  /** Produtos visíveis na loja (público) */
  async listStore(query: { marca?: string; categoria?: string; q?: string }) {
    const where: any = {
      visivelLoja: true,
      ativo: true,
      ...(query.categoria && { categoria: query.categoria }),
      ...(query.marca && { marcasCompativel: { has: query.marca } }),
      ...(query.q && {
        OR: [
          { nome: { contains: query.q, mode: "insensitive" } },
          { descricao: { contains: query.q, mode: "insensitive" } },
        ],
      }),
    };

    return prisma.product.findMany({
      where,
      select: {
        id: true,
        nome: true,
        codigo: true,
        descricao: true,
        categoria: true,
        marcasCompativel: true,
        valor: true,
        imagemUrl: true,
        quantidade: true,
      },
      orderBy: { nome: "asc" },
    });
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { supplier: true },
    });
    if (!product) throw new NotFoundError("Produto");
    return product;
  }

  async create(dto: CreateProductDTO) {
    const exists = await prisma.product.findUnique({ where: { codigo: dto.codigo } });
    if (exists) throw new ConflictError("Código de produto já cadastrado");

    return prisma.product.create({
      data: {
        nome: dto.nome.trim(),
        codigo: dto.codigo.trim(),
        descricao: dto.descricao,
        categoria: dto.categoria,
        marcasCompativel: dto.marcasCompativel ?? [],
        valor: new Decimal(dto.valor),
        precoCusto: new Decimal(dto.precoCusto ?? 0),
        quantidade: new Decimal(dto.quantidade ?? 0),
        quantidadeMinima: new Decimal(dto.quantidadeMinima ?? 0),
        visivelLoja: dto.visivelLoja ?? false,
        ativo: dto.ativo ?? true,
        codigoBarras: dto.codigoBarras,
        localizacao: dto.localizacao,
        peso: dto.peso,
        dimensoes: dto.dimensoes,
        validade: dto.validade ? new Date(dto.validade) : null,
        imagemUrl: dto.imagemUrl,
        fornecedorId: dto.fornecedorId,
      },
      include: { supplier: { select: { id: true, nome: true } } },
    });
  }

  async update(id: string, dto: UpdateProductDTO) {
    await this.findById(id);
    if (dto.codigo) {
      const exists = await prisma.product.findFirst({
        where: { codigo: dto.codigo, NOT: { id } },
      });
      if (exists) throw new ConflictError("Código de produto já cadastrado");
    }

    return prisma.product.update({
      where: { id },
      data: {
        nome: dto.nome?.trim(),
        codigo: dto.codigo?.trim(),
        descricao: dto.descricao,
        categoria: dto.categoria,
        marcasCompativel: dto.marcasCompativel,
        valor: dto.valor !== undefined ? new Decimal(dto.valor) : undefined,
        precoCusto: dto.precoCusto !== undefined ? new Decimal(dto.precoCusto) : undefined,
        quantidade: dto.quantidade !== undefined ? new Decimal(dto.quantidade) : undefined,
        quantidadeMinima:
          dto.quantidadeMinima !== undefined ? new Decimal(dto.quantidadeMinima) : undefined,
        visivelLoja: dto.visivelLoja,
        ativo: dto.ativo,
        codigoBarras: dto.codigoBarras,
        localizacao: dto.localizacao,
        peso: dto.peso,
        dimensoes: dto.dimensoes,
        validade: dto.validade ? new Date(dto.validade) : undefined,
        imagemUrl: dto.imagemUrl,
        fornecedorId: dto.fornecedorId,
      },
      include: { supplier: { select: { id: true, nome: true } } },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    await prisma.product.update({ where: { id }, data: { ativo: false, visivelLoja: false } });
  }
}

export const productsService = new ProductsService();
