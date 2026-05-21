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
