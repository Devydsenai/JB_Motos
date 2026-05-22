type AssistenteAdministrativoRequest = {
  usuario: string;
  perfil: string;
  message: string;
  page: string;
};

export type AssistenteAdministrativoResponse = {
  ok?: boolean;
  reply?: string;
  quickReplies?: string[];
  actions?: Array<{
    type: string;
    payload?: Record<string, unknown>;
  }>;
  checklist?: string[];
  data?: Record<string, unknown>;
};

import { postAssistenteViaApi } from "./assistenteProxy";

const ASSISTENTE_ADMIN_URL = import.meta.env.VITE_N8N_ADMIN_ASSISTANT_URL;
const USE_API_PROXY = Boolean(import.meta.env.VITE_API_URL);

async function enviarDiretoN8n(
  payload: AssistenteAdministrativoRequest,
): Promise<AssistenteAdministrativoResponse> {
  if (!ASSISTENTE_ADMIN_URL) {
    throw new Error(
      "Configure N8N_ADMIN_ASSISTANT_URL no Render ou VITE_N8N_ADMIN_ASSISTANT_URL na Netlify.",
    );
  }

  const response = await fetch(ASSISTENTE_ADMIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Assistente administrativo indisponível (${response.status}).`);
  }

  return response.json() as Promise<AssistenteAdministrativoResponse>;
}

export async function enviarMensagemAssistenteAdministrativo(
  payload: AssistenteAdministrativoRequest,
): Promise<AssistenteAdministrativoResponse> {
  if (USE_API_PROXY) {
    try {
      return await postAssistenteViaApi<AssistenteAdministrativoResponse>(
        "/admin",
        payload,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      const servidorSemN8n =
        msg.includes("N8N") || msg.includes("não configurado no servidor");
      if (servidorSemN8n && ASSISTENTE_ADMIN_URL) {
        return enviarDiretoN8n(payload);
      }
      throw err;
    }
  }

  return enviarDiretoN8n(payload);
}
