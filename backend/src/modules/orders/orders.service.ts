import { Decimal } from "../../shared/utils/decimal.js";
import { prisma } from "../../prisma/client.js";
import { AppError, NotFoundError } from "../../shared/errors/AppError.js";
import { CreateOrderDTO } from "./orders.schemas.js";

type OrderOwner = { customerId?: string; sessionId?: string };

export class OrdersService {
  async createFromCart(dto: CreateOrderDTO, owner: OrderOwner) {
    const cartWhere = owner.customerId
      ? { storeCustomerId: owner.customerId }
      : owner.sessionId
        ? { sessionId: owner.sessionId }
        : null;

    if (!cartWhere) throw new AppError("Informe login ou sessionId", 400);

    const cartItems = await prisma.cartItem.findMany({
      where: cartWhere,
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new AppError("Carrinho vazio", 400);
    }

    let subtotal = new Decimal(0);
    const orderItems = cartItems.map((item) => {
      const preco = new Decimal(item.product.valor);
      const lineSubtotal = preco.times(item.quantidade);
      subtotal = subtotal.plus(lineSubtotal);
      return {
        productId: item.productId,
        nomeSnapshot: item.product.nome,
        precoUnitario: preco,
        quantidade: item.quantidade,
        subtotal: lineSubtotal,
      };
    });

    const frete = new Decimal(dto.frete ?? 0);
    const desconto = new Decimal(dto.desconto ?? 0);
    const total = subtotal.plus(frete).minus(desconto);

    return prisma.$transaction(async (tx) => {
      const order = await tx.storeOrder.create({
        data: {
          storeCustomerId: owner.customerId,
          status: "PENDENTE",
          observacao: dto.observacao,
          subtotal,
          frete,
          desconto,
          total,
          entregaNome: dto.entregaNome,
          entregaEmail: dto.entregaEmail,
          entregaTelefone: dto.entregaTelefone,
          entregaEndereco: dto.entregaEndereco,
          entregaCidade: dto.entregaCidade,
          entregaEstado: dto.entregaEstado,
          entregaCep: dto.entregaCep,
          entregaPais: dto.entregaPais,
          items: { create: orderItems },
        },
        include: { items: { include: { product: true } }, payments: true },
      });

      await tx.cartItem.deleteMany({ where: cartWhere });
      return order;
    });
  }

  async findById(id: string, customerId?: string) {
    const order = await prisma.storeOrder.findUnique({
      where: { id },
      include: { items: true, payments: true },
    });
    if (!order) throw new NotFoundError("Pedido");
    if (customerId && order.storeCustomerId !== customerId) {
      throw new AppError("Pedido não pertence a este cliente", 403);
    }
    return order;
  }

  async listByCustomer(customerId: string) {
    return prisma.storeOrder.findMany({
      where: { storeCustomerId: customerId },
      include: { items: true, payments: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async listAdmin(query: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;
    const where = status ? { status: status as any } : {};

    const [data, total] = await prisma.$transaction([
      prisma.storeOrder.findMany({
        where,
        include: { items: true, storeCustomer: { select: { id: true, nome: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.storeOrder.count({ where }),
    ]);

    return { data, meta: { total, page, limit } };
  }
}

export const ordersService = new OrdersService();
