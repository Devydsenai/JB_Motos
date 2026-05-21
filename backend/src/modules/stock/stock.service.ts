import { Prisma } from "../../../generated/prisma/client.js";
import { Decimal } from "../../shared/utils/decimal.js";
import { prisma } from "../../prisma/client.js";
import { AppError, NotFoundError } from "../../shared/errors/AppError.js";
import { MovementDTO } from "./stock.schemas.js";

export class StockService {
  async listMovements(query: { page: number; limit: number; productId?: string }) {
    const { page, limit, productId } = query;
    const skip = (page - 1) * limit;

    const where = productId ? { productId } : {};

    const [data, total] = await prisma.$transaction([
      prisma.stockMovement.findMany({
        where,
        include: {
          product: { select: { id: true, nome: true, codigo: true } },
          user: { select: { id: true, nome: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.stockMovement.count({ where }),
    ]);

    return { data, meta: { total, page, limit } };
  }

  async lowStock() {
    const products = await prisma.product.findMany({
      where: { ativo: true },
      select: {
        id: true,
        nome: true,
        codigo: true,
        quantidade: true,
        quantidadeMinima: true,
        visivelLoja: true,
      },
    });

    return products.filter((p) => {
      const q = Number(p.quantidade);
      const min = Number(p.quantidadeMinima);
      return min > 0 && q <= min;
    });
  }

  async move(dto: MovementDTO, userId?: string) {
    const product = await prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundError("Produto");

    const saldoAntes = new Decimal(product.quantidade);
    let saldoDepois: Prisma.Decimal;

    if (dto.tipo === "ENTRADA") {
      saldoDepois = saldoAntes.plus(dto.quantidade);
    } else if (dto.tipo === "SAIDA") {
      saldoDepois = saldoAntes.minus(dto.quantidade);
      if (saldoDepois.lessThan(0)) {
        throw new AppError("Estoque insuficiente para saída", 422);
      }
    } else {
      saldoDepois = new Decimal(dto.quantidade);
    }

    return prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: dto.productId },
        data: { quantidade: saldoDepois },
      });

      return tx.stockMovement.create({
        data: {
          productId: dto.productId,
          tipo: dto.tipo,
          quantidade: new Decimal(dto.quantidade),
          saldoAntes,
          saldoDepois,
          observacao: dto.observacao,
          userId,
        },
        include: { product: { select: { nome: true, codigo: true } } },
      });
    });
  }
}

export const stockService = new StockService();
