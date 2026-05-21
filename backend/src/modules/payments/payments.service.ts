import { Decimal } from "../../shared/utils/decimal.js";
import { prisma } from "../../prisma/client.js";
import { env } from "../../config/env.js";
import { getFrontendUrl, getPreferenceClient } from "../../config/mercadopago.js";
import { AppError, NotFoundError } from "../../shared/errors/AppError.js";
import { CreatePaymentDTO, CreatePreferenceDTO } from "./payments.schemas.js";

export class PaymentsService {
  private getMercadoPagoFrontendUrl() {
    return getFrontendUrl().replace("localhost", "127.0.0.1");
  }

  private buildBackUrls() {
    const frontend = this.getMercadoPagoFrontendUrl();
    return {
      success: `${frontend}/loja`,
      failure: `${frontend}/loja/checkout/cancelado`,
      pending: `${frontend}/loja/checkout/pendente`,
    };
  }

  private canUseAutoReturn(backUrls: { success: string }) {
    return backUrls.success.startsWith("https://");
  }

  /**
   * Checkout Pro — cria preferência no Mercado Pago e retorna o link (init_point).
   * Fluxo igual à documentação: Preference.create({ body }).
   */
  async createCheckoutPreference(dto: CreatePreferenceDTO) {
    if (!dto.orderId) {
      return this.createDirectCheckoutPreference(dto);
    }

    const order = await prisma.storeOrder.findUnique({
      where: { id: dto.orderId },
      include: {
        items: true,
        storeCustomer: { select: { nome: true, email: true } },
      },
    });
    if (!order) throw new NotFoundError("Pedido");
    if (order.items.length === 0) throw new AppError("Pedido sem itens", 400);

    const items = order.items.map((item) => ({
      id: item.productId,
      title: item.nomeSnapshot,
      quantity: item.quantidade,
      currency_id: "BRL",
      unit_price: Number(item.precoUnitario),
    }));

    const frete = Number(order.frete);
    if (frete > 0) {
      items.push({
        id: "frete",
        title: "Frete",
        quantity: 1,
        currency_id: "BRL",
        unit_price: frete,
      });
    }

    const payerEmail =
      dto.payer?.email ?? order.entregaEmail ?? order.storeCustomer?.email ?? undefined;
    const payerName =
      dto.payer?.name ?? order.entregaNome ?? order.storeCustomer?.nome ?? undefined;

    const backUrls = this.buildBackUrls();
    const body: Record<string, unknown> = {
      items,
      external_reference: order.id,
      statement_descriptor: "JB MOTOS",
      back_urls: backUrls,
    };

    if (this.canUseAutoReturn(backUrls)) {
      body.auto_return = "approved";
    }

    if (payerEmail || payerName) {
      body.payer = {
        ...(payerName && { name: payerName.split(" ")[0] }),
        ...(payerName && { surname: payerName.split(" ").slice(1).join(" ") || "Cliente" }),
        ...(payerEmail && { email: payerEmail }),
      };
    }

    if (env.API_PUBLIC_URL) {
      body.notification_url = `${env.API_PUBLIC_URL}/api/v1/store/payments/webhook/mercadopago`;
    }

    const preference = getPreferenceClient();
    const response = await preference.create({ body: body as any });
    const mp = response as typeof response & { preference_expired?: boolean };

    if (mp.preference_expired) {
      throw new AppError("Preferência de pagamento expirada. Crie uma nova.", 410);
    }

    const checkoutLink = mp.init_point;

    if (!checkoutLink) {
      throw new AppError("Mercado Pago não retornou link de checkout", 502);
    }

    await prisma.payment.create({
      data: {
        orderId: order.id,
        metodo: "CARTAO_CREDITO",
        status: "PENDENTE",
        valor: order.total,
        mercadoPagoId: mp.id ?? null,
        referenciaExterna: mp.id ?? order.id,
        metadata: {
          provider: "mercadopago",
          collector_id: mp.collector_id,
          init_point: mp.init_point,
          sandbox_init_point: mp.sandbox_init_point,
          preference_id: mp.id,
          date_created: mp.date_created,
        },
      },
    });

    return {
      /** URL para redirecionar o cliente (use window.location.href = link) */
      link: checkoutLink,
      id: mp.id,
      init_point: checkoutLink,
      collector_id: mp.collector_id,
      external_reference: order.id,
      preference_expired: mp.preference_expired ?? false,
    };
  }

  /**
   * Checkout direto — usado pela loja enquanto o carrinho ainda esta local no frontend.
   * Quando o carrinho/pedido estiver 100% no backend, use o fluxo por orderId acima.
   */
  private async createDirectCheckoutPreference(dto: CreatePreferenceDTO) {
    if (!dto.items?.length) throw new AppError("Informe itens para o checkout", 400);

    const externalReference = dto.externalReference ?? `checkout-${Date.now()}`;
    const backUrls = this.buildBackUrls();
    const body: Record<string, unknown> = {
      items: dto.items.map((item) => ({
        id: item.id ?? item.title,
        title: item.title,
        quantity: item.quantity,
        currency_id: "BRL",
        unit_price: item.unit_price,
      })),
      external_reference: externalReference,
      statement_descriptor: "JB MOTOS",
      back_urls: backUrls,
    };

    if (this.canUseAutoReturn(backUrls)) {
      body.auto_return = "approved";
    }

    if (dto.payer?.email || dto.payer?.name || dto.payer?.surname) {
      body.payer = {
        ...(dto.payer.name && { name: dto.payer.name }),
        ...(dto.payer.surname && { surname: dto.payer.surname }),
        ...(dto.payer.email && { email: dto.payer.email }),
      };
    }

    if (env.API_PUBLIC_URL) {
      body.notification_url = `${env.API_PUBLIC_URL}/api/v1/store/payments/webhook/mercadopago`;
    }

    const preference = getPreferenceClient();
    const response = await preference.create({ body: body as any });
    const mp = response as typeof response & { preference_expired?: boolean };

    if (mp.preference_expired) {
      throw new AppError("Preferência de pagamento expirada. Crie uma nova.", 410);
    }

    const checkoutLink = mp.init_point;

    if (!checkoutLink) {
      throw new AppError("Mercado Pago não retornou link de checkout", 502);
    }

    return {
      link: checkoutLink,
      id: mp.id,
      init_point: checkoutLink,
      collector_id: mp.collector_id,
      external_reference: externalReference,
      preference_expired: mp.preference_expired ?? false,
    };
  }

  async create(dto: CreatePaymentDTO) {
    const order = await prisma.storeOrder.findUnique({
      where: { id: dto.orderId },
      include: { payments: true },
    });
    if (!order) throw new NotFoundError("Pedido");

    const valor = new Decimal(dto.valor ?? order.total);

    let pixQrCode: string | null = null;
    let pixCopiaCola: string | null = null;
    let referenciaExterna: string | null = null;

    if (dto.metodo === "PIX") {
      referenciaExterna = `PIX-${order.numero}-${Date.now()}`;
      pixCopiaCola = `00020126580014BR.GOV.BCB.PIX0136${referenciaExterna}520400005303986540${valor.toFixed(2)}5802BR5925JB MOTOS OFICINA6009RECIFE62070503***6304ABCD`;
      pixQrCode = pixCopiaCola;
    } else {
      referenciaExterna = `MP-${order.numero}-${Date.now()}`;
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: dto.orderId,
        metodo: dto.metodo,
        status: "PENDENTE",
        valor,
        referenciaExterna,
        pixQrCode,
        pixCopiaCola,
        metadata: { provider: "mock" },
      },
    });

    return payment;
  }

  async findByOrder(orderId: string) {
    return prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
  }

  async confirmMock(referenciaExterna: string, status: "APROVADO" | "RECUSADO" | "CANCELADO") {
    const payment = await prisma.payment.findFirst({
      where: { referenciaExterna },
      include: { order: true },
    });
    if (!payment) throw new NotFoundError("Pagamento");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id: payment.id },
        data: { status },
      });

      if (status === "APROVADO") {
        await tx.storeOrder.update({
          where: { id: payment.orderId },
          data: { status: "PAGO" },
        });
      }

      return updated;
    });
  }

  async webhook(body: {
    referenciaExterna: string;
    status: string;
    mercadoPagoId?: string;
  }) {
    const allowed = ["APROVADO", "RECUSADO", "CANCELADO", "REEMBOLSADO"];
    if (!allowed.includes(body.status)) {
      throw new AppError("Status de pagamento inválido", 422);
    }

    const payment = await prisma.payment.findFirst({
      where: { referenciaExterna: body.referenciaExterna },
    });
    if (!payment) throw new NotFoundError("Pagamento");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: body.status as any,
          mercadoPagoId: body.mercadoPagoId,
        },
      });

      if (body.status === "APROVADO") {
        await tx.storeOrder.update({
          where: { id: payment.orderId },
          data: { status: "PAGO" },
        });
      }

      return updated;
    });
  }
}

export const paymentsService = new PaymentsService();
