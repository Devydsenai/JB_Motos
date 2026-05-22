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

export async function enviarMensagemAssistenteAdministrativo(
  payload: AssistenteAdministrativoRequest,
): Promise<AssistenteAdministrativoResponse> {
  if (USE_API_PROXY) {
    return postAssistenteViaApi<AssistenteAdministrativoResponse>("/admin", payload);
  }

  if (!ASSISTENTE_ADMIN_URL) {
    throw new Error(
      "Configure VITE_N8N_ADMIN_ASSISTANT_URL ou VITE_API_URL no .env do frontend.",
    );
  }

  const response = await fetch(ASSISTENTE_ADMIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Assistente administrativo indisponível (${response.status}).`);
  }

  return response.json() as Promise<AssistenteAdministrativoResponse>;
}
