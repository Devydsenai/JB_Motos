import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/AppError.js";

async function proxyToN8n(
  targetUrl: string | undefined,
  label: string,
  body: unknown,
): Promise<unknown> {
  if (!targetUrl) {
    throw new AppError(
      `${label} não configurado no servidor (N8N_* no Render).`,
      503,
    );
  }

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let data: unknown = {};
  if (text) {
    try {
      data = JSON.parse(text) as unknown;
    } catch {
      throw new AppError("Resposta inválida do assistente n8n.", 502);
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : `Assistente indisponível (${response.status}).`;
    throw new AppError(message, response.status >= 500 ? 502 : response.status);
  }

  return data;
}

export function proxyClienteAssistant(body: unknown) {
  return proxyToN8n(
    env.N8N_CLIENT_ASSISTANT_URL,
    "Assistente do cliente",
    body,
  );
}

export function proxyAdminAssistant(body: unknown) {
  return proxyToN8n(
    env.N8N_ADMIN_ASSISTANT_URL,
    "Assistente administrativo",
    body,
  );
}
