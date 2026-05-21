import type { PerfilSistema } from "@/config/permissoes";
import { apiRequest } from "@/lib/api";
import {
  saveAdminAuth,
  saveStoreAuth,
  type AdminAuth,
  type AdminRole,
} from "./authStorage";

export type LoginResult =
  | { tipo: "admin"; auth: AdminAuth; perfil: PerfilSistema; redirectTo: string }
  | { tipo: "cliente"; redirectTo: string };

function roleToPerfil(role: AdminRole): PerfilSistema {
  if (role === "PROPRIETARIO") return "dono";
  if (role === "MECANICO") return "mecanico";
  return "atendente";
}

/** Login único: tenta equipe (proprietário/atendente/mecânico) e depois cliente da loja */
export async function loginUnificado(
  email: string,
  senha: string,
): Promise<LoginResult> {
  const emailNorm = email.trim().toLowerCase();

  try {
    const data = await apiRequest<{ token: string; user: AdminAuth["user"] }>(
      "/api/v1/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email: emailNorm, senha }),
      },
    );

    const auth: AdminAuth = { token: data.token, user: data.user };
    saveAdminAuth(auth);

    return {
      tipo: "admin",
      auth,
      perfil: roleToPerfil(data.user.role),
      redirectTo: "/admin",
    };
  } catch {
    /* tenta cliente da loja */
  }

  const storeData = await apiRequest<{
    token: string;
    customer: { id: string; nome: string; email: string };
  }>("/api/v1/store/customers/login", {
    method: "POST",
    body: JSON.stringify({ email: emailNorm, senha }),
  });

  saveStoreAuth({ token: storeData.token, customer: storeData.customer });

  return {
    tipo: "cliente",
    redirectTo: "/loja/minha-conta",
  };
}
