import { prisma } from "../../prisma/client.js";
import { AppError, NotFoundError } from "../../shared/errors/AppError.js";

export class WishlistService {
  async list(customerId: string) {
    return prisma.wishlistItem.findMany({
      where: { storeCustomerId: customerId },
      include: {
        product: {
          select: {
            id: true,
            nome: true,
            codigo: true,
            valor: true,
            imagemUrl: true,
            categoria: true,
            marcasCompativel: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async add(customerId: string, productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.ativo) throw new AppError("Produto indisponível", 400);

    return prisma.wishlistItem.upsert({
      where: { storeCustomerId_productId: { storeCustomerId: customerId, productId } },
      update: {},
      create: { storeCustomerId: customerId, productId },
      include: { product: true },
    });
  }

  async remove(customerId: string, productId: string) {
    const item = await prisma.wishlistItem.findUnique({
      where: { storeCustomerId_productId: { storeCustomerId: customerId, productId } },
    });
    if (!item) throw new NotFoundError("Favorito");
    await prisma.wishlistItem.delete({ where: { id: item.id } });
  }
}

export const wishlistService = new WishlistService();
