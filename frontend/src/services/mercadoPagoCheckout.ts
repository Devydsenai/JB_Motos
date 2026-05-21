import { apiRequest } from "@/lib/api";
import type { CartItem } from "@/pages/store/lojaTypes";

type MercadoPagoPreferenceResponse = {
  link?: string;
  init_point?: string;
  sandbox_init_point?: string;
  id?: string;
  external_reference?: string;
  testMode?: boolean;
};

type Payer = {
  name?: string;
  surname?: string;
  email?: string;
};

function parsePrice(price: string) {
  const normalized = price.replace(/[^\d,]/g, "").replace(",", ".");
  return Number(normalized) || 0;
}

export async function criarCheckoutMercadoPago({
  items,
  payer,
}: {
  items: CartItem[];
  payer?: Payer;
}) {
  return apiRequest<MercadoPagoPreferenceResponse>("/api/v1/store/payments/preference", {
    method: "POST",
    body: JSON.stringify({
      externalReference: `checkout-loja-${Date.now()}`,
      payer,
      items: items.map((item) => ({
        id: item.id,
        title: item.name,
        quantity: item.quantity,
        unit_price: parsePrice(item.price),
      })),
    }),
  });
}
