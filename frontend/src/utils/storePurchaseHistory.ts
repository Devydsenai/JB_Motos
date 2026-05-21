import { readStoreAuth } from "@/services/authStorage";
import type { CartItem } from "@/pages/store/lojaTypes";

export const STORAGE_CART = "jb-motos-store-cart";
export const STORAGE_PURCHASE_HISTORY = "jb-motos-store-purchase-history";

export type PurchaseStatus = "aguardando_pagamento" | "pago" | "pendente" | "cancelado";

export type PurchaseHistoryItem = {
  id: string;
  mercadoPagoPreferenceId?: string;
  mercadoPagoPaymentId?: string;
  customerId: string;
  customerName: string;
  status: PurchaseStatus;
  createdAt: string;
  paidAt?: string;
  total: number;
  items: CartItem[];
};

function readAllPurchaseHistory(): PurchaseHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_PURCHASE_HISTORY);
    const parsed = raw ? (JSON.parse(raw) as PurchaseHistoryItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePurchaseHistory(history: PurchaseHistoryItem[]) {
  localStorage.setItem(STORAGE_PURCHASE_HISTORY, JSON.stringify(history));
}

export function clearStoreCart() {
  localStorage.setItem(STORAGE_CART, JSON.stringify([]));
}

export function savePendingPurchase({
  items,
  total,
  preferenceId,
  externalReference,
}: {
  items: CartItem[];
  total: number;
  preferenceId?: string;
  externalReference?: string;
}) {
  const auth = readStoreAuth();
  const history = readAllPurchaseHistory();

  writePurchaseHistory([
    {
      id: externalReference ?? `compra-${Date.now()}`,
      mercadoPagoPreferenceId: preferenceId,
      customerId: auth?.customer.id ?? "cliente-anonimo",
      customerName: auth?.customer.nome ?? "Cliente da loja",
      status: "aguardando_pagamento",
      createdAt: new Date().toISOString(),
      total,
      items,
    },
    ...history,
  ]);
}

function normalizeStatus(value: string | null | undefined) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function isMercadoPagoPaymentApproved(
  collectionStatus?: string | null,
  status?: string | null,
) {
  const combined = `${normalizeStatus(collectionStatus)} ${normalizeStatus(status)}`;
  return (
    combined.includes("approved") ||
    combined.includes("aprovado") ||
    combined.includes("success") ||
    combined.includes("accredited")
  );
}

export function isMercadoPagoPaymentPending(
  collectionStatus?: string | null,
  status?: string | null,
) {
  const combined = `${normalizeStatus(collectionStatus)} ${normalizeStatus(status)}`;
  return combined.includes("pending") || combined.includes("pendente");
}

export function confirmPurchaseFromReturn(params: {
  externalReference?: string | null;
  preferenceId?: string | null;
  paymentId?: string | null;
  collectionStatus?: string | null;
  status?: string | null;
}) {
  const history = readAllPurchaseHistory();
  const approved = isMercadoPagoPaymentApproved(
    params.collectionStatus,
    params.status,
  );
  const pending = isMercadoPagoPaymentPending(
    params.collectionStatus,
    params.status,
  );

  let matched = false;

  const updated = history.map((purchase) => {
    const byReference =
      params.externalReference && purchase.id === params.externalReference;
    const byPreference =
      params.preferenceId &&
      purchase.mercadoPagoPreferenceId === params.preferenceId;

    if (!byReference && !byPreference) return purchase;

    matched = true;

    if (approved) {
      return {
        ...purchase,
        status: "pago" as const,
        paidAt: new Date().toISOString(),
        mercadoPagoPaymentId: params.paymentId ?? purchase.mercadoPagoPaymentId,
      };
    }

    if (pending) {
      return {
        ...purchase,
        status: "pendente" as const,
        mercadoPagoPaymentId: params.paymentId ?? purchase.mercadoPagoPaymentId,
      };
    }

    return purchase;
  });

  if (!matched) {
    const auth = readStoreAuth();
    const customerId = auth?.customer.id ?? "cliente-anonimo";
    const pendingPurchase = history.find(
      (purchase) =>
        purchase.customerId === customerId &&
        purchase.status === "aguardando_pagamento",
    );

    if (pendingPurchase && approved) {
      const index = history.indexOf(pendingPurchase);
      updated[index] = {
        ...pendingPurchase,
        status: "pago",
        paidAt: new Date().toISOString(),
        mercadoPagoPaymentId: params.paymentId ?? pendingPurchase.mercadoPagoPaymentId,
      };
      matched = true;
    }
  }

  writePurchaseHistory(updated);

  if (approved) {
    clearStoreCart();
  }

  return { approved, pending, matched };
}

export function readPurchaseHistoryForCurrentCustomer(): PurchaseHistoryItem[] {
  const auth = readStoreAuth();
  const customerId = auth?.customer.id ?? "cliente-anonimo";
  return readAllPurchaseHistory().filter(
    (purchase) => purchase.customerId === customerId,
  );
}

export function purchaseStatusLabel(status: PurchaseStatus | string) {
  switch (status) {
    case "pago":
      return "Pago";
    case "pendente":
      return "Pagamento pendente";
    case "cancelado":
      return "Cancelado";
    default:
      return "Aguardando pagamento";
  }
}
