export type AdminRole = "PROPRIETARIO" | "ATENDENTE" | "MECANICO";

export type AdminUser = {
  id: string;
  nome: string;
  email: string;
  role: AdminRole;
};

export type AdminAuth = {
  token: string;
  user: AdminUser;
};

export type StoreCustomerAuth = {
  token: string;
  customer: {
    id: string;
    nome: string;
    email: string;
  };
};

const KEY_ADMIN = "jb-motos-admin-auth";
const KEY_STORE = "jb-motos-store-auth";
export const KEY_CLIENT_SESSION = "jb-motos-client-session";

export function readAdminAuth(): AdminAuth | null {
  try {
    const raw = localStorage.getItem(KEY_ADMIN);
    if (!raw) return null;
    return JSON.parse(raw) as AdminAuth;
  } catch {
    return null;
  }
}

export function saveAdminAuth(auth: AdminAuth) {
  localStorage.setItem(KEY_ADMIN, JSON.stringify(auth));
  localStorage.removeItem(KEY_STORE);
  localStorage.removeItem(KEY_CLIENT_SESSION);
}

export function readStoreAuth(): StoreCustomerAuth | null {
  try {
    const raw = localStorage.getItem(KEY_STORE);
    if (!raw) return null;
    return JSON.parse(raw) as StoreCustomerAuth;
  } catch {
    return null;
  }
}

export function saveStoreAuth(auth: StoreCustomerAuth) {
  localStorage.setItem(KEY_STORE, JSON.stringify(auth));
  localStorage.setItem(KEY_CLIENT_SESSION, "true");
  localStorage.removeItem(KEY_ADMIN);
}

export function clearAllAuth() {
  localStorage.removeItem(KEY_ADMIN);
  localStorage.removeItem(KEY_STORE);
  localStorage.removeItem(KEY_CLIENT_SESSION);
  localStorage.removeItem("jb-motos-sessao");
  localStorage.removeItem("jb-motos-perfil-sistema");
}
