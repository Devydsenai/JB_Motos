import { MercadoPagoConfig, Preference } from "mercadopago";
import { env } from "./env.js";
import { AppError } from "../shared/errors/AppError.js";

export function getFrontendUrl(): string {
  return env.FRONTEND_URL ?? env.ALLOWED_ORIGINS.split(",")[0]?.trim() ?? "http://localhost:5173";
}

export function getMercadoPagoConfig(): MercadoPagoConfig {
  const token = env.MERCADO_PAGO_ACCESS_TOKEN?.trim();
  if (!token) {
    throw new AppError(
      "Mercado Pago não configurado. Defina MERCADO_PAGO_ACCESS_TOKEN no arquivo .env",
      503,
    );
  }
  return new MercadoPagoConfig({ accessToken: token });
}

export function getPreferenceClient(): Preference {
  return new Preference(getMercadoPagoConfig());
}

/** Checkout Pro em ambiente de testes (cartão/PIX fictícios no sandbox do MP). */
export function isMercadoPagoSandbox(): boolean {
  if (env.MERCADO_PAGO_SANDBOX === true) return true;
  if (env.MERCADO_PAGO_SANDBOX === false) return false;
  return env.NODE_ENV !== "production";
}

export type MercadoPagoPreferenceLike = {
  init_point?: string;
  sandbox_init_point?: string;
};

export function resolveMercadoPagoCheckoutUrl(
  preference: MercadoPagoPreferenceLike,
): string | undefined {
  if (isMercadoPagoSandbox()) {
    return preference.sandbox_init_point ?? preference.init_point;
  }
  return preference.init_point ?? preference.sandbox_init_point;
}
