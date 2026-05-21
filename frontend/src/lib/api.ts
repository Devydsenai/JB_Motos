const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, headers: customHeaders, ...rest } = options;
  const headers = new Headers(customHeaders);
  if (!headers.has("Content-Type") && rest.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  const json = (await res.json().catch(() => ({}))) as ApiEnvelope<T> & T;

  if (!res.ok) {
    const message =
      (json as ApiEnvelope<T>).message ??
      (json as { message?: string }).message ??
      "Erro na requisição";
    throw new Error(message);
  }

  if ((json as ApiEnvelope<T>).success === true && "data" in json) {
    return (json as ApiEnvelope<T>).data as T;
  }

  return json as T;
}
