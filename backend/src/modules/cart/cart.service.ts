import { prisma } from "../../prisma/client.js";
import { AppError, NotFoundError } from "../../shared/errors/AppError.js";
import { AddCartDTO } from "./cart.schemas.js";

type CartOwner = { customerId?: string; sessionId?: string };

export class CartService {
  private where(owner: CartOwner) {
    if (owner.customerId) return { storeCustomerId: owner.customerId };
    if (owner.sessionId) return { sessionId: owner.sessionId };
    throw new AppError("Informe login ou sessionId", 400);
  }

  async list(owner: CartOwner) {
    return prisma.cartItem.findMany({
      where: this.where(owner),
      include: {
        product: {
          select: {
            id: true,
            nome: true,
            codigo: true,
            valor: true,
            imagemUrl: true,
            visivelLoja: true,
            ativo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async add(dto: AddCartDTO, owner: CartOwner) {
    const product = await prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product || !product.ativo || !product.visivelLoja) {
      throw new AppError("Produto indisponível na loja", 400);
    }

    const where = {
      ...this.where(owner),
      productId: dto.productId,
    };

    const existing = await prisma.cartItem.findFirst({ where });

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantidade: existing.quantidade + dto.quantidade },
        include: { product: true },
      });
    }

    return prisma.cartItem.create({
      data: {
        storeCustomerId: owner.customerId,
        sessionId: owner.sessionId,
        productId: dto.productId,
        quantidade: dto.quantidade,
      },
      include: { product: true },
    });
  }

  async update(itemId: string, quantidade: number, owner: CartOwner) {
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, ...this.where(owner) },
    });
    if (!item) throw new NotFoundError("Item do carrinho");

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantidade },
      include: { product: true },
    });
  }

  async remove(itemId: string, owner: CartOwner) {
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, ...this.where(owner) },
    });
    if (!item) throw new NotFoundError("Item do carrinho");
    await prisma.cartItem.delete({ where: { id: itemId } });
  }

  async clear(owner: CartOwner) {
    await prisma.cartItem.deleteMany({ where: this.where(owner) });
  }
}

export const cartService = new CartService();
