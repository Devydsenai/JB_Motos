type AssistenteClienteRequest = {
  sessionId: string;
  message: string;
  page: string;
  cart: unknown[];
};

export type AssistenteClienteResponse = {
  ok?: boolean;
  reply?: string;
  quickReplies?: string[];
  actions?: Array<{
    type: string;
    payload?: Record<string, unknown>;
  }>;
  data?: Record<string, unknown>;
};

const ASSISTENTE_CLIENTE_URL = import.meta.env.VITE_N8N_CLIENT_ASSISTANT_URL;

export async function enviarMensagemAssistenteCliente(
  payload: AssistenteClienteRequest,
): Promise<AssistenteClienteResponse> {
  if (!ASSISTENTE_CLIENTE_URL) {
    throw new Error(
      "Configure VITE_N8N_CLIENT_ASSISTANT_URL no .env do frontend.",
    );
  }

  const response = await fetch(ASSISTENTE_CLIENTE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Assistente indisponível (${response.status}).`);
  }

  return response.json() as Promise<AssistenteClienteResponse>;
}
