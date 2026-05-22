const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

/** POST no proxy da API (evita CORS e variáveis n8n na Netlify). */
export async function postAssistenteViaApi<T>(
  path: "/client" | "/admin",
  body: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE}/api/v1/assistants${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as T & {
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : `Assistente indisponível (${res.status}).`,
    );
  }

  return data as T;
}
