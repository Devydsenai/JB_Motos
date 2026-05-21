import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { administradorMock } from "@/data/mockAdministrador";
import {
  exigeCodigoFuncionario as calcExigeCodigo,
  perfilSistemaLabels,
  type PerfilSistema,
} from "@/config/permissoes";
import {
  clearAllAuth,
  readAdminAuth,
  type AdminAuth,
  type AdminRole,
} from "@/services/authStorage";

const STORAGE_SESSAO = "jb-motos-sessao";

function roleToPerfil(role: AdminRole): PerfilSistema {
  if (role === "PROPRIETARIO") return "dono";
  if (role === "MECANICO") return "mecanico";
  return "atendente";
}

type SessaoPersistida = {
  perfil: PerfilSistema;
  funcionarioId?: string;
  userId?: string;
  logado: boolean;
};

function sessaoFromAdminAuth(auth: AdminAuth): SessaoPersistida {
  const perfil = roleToPerfil(auth.user.role);
  return {
    perfil,
    logado: true,
    userId: auth.user.id,
    funcionarioId: undefined,
  };
}

function readSessao(): SessaoPersistida {
  const admin = readAdminAuth();
  if (admin?.token) {
    return sessaoFromAdminAuth(admin);
  }

  try {
    const raw = localStorage.getItem(STORAGE_SESSAO);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SessaoPersistida>;
      const perfil = parsed.perfil;
      if (perfil === "atendente" || perfil === "mecanico" || perfil === "dono") {
        return {
          perfil,
          funcionarioId: parsed.funcionarioId,
          userId: parsed.userId,
          logado: false,
        };
      }
    }
  } catch {
    /* ignore */
  }

  return { perfil: "dono", logado: false };
}

function persistirSessao(sessao: SessaoPersistida) {
  try {
    localStorage.setItem(STORAGE_SESSAO, JSON.stringify(sessao));
  } catch {
    /* ignore */
  }
}

type SessaoContextValue = {
  perfil: PerfilSistema;
  funcionarioId: string | null;
  userId: string | null;
  logado: boolean;
  adminUser: AdminAuth["user"] | null;
  administrador: typeof administradorMock;
  setPerfil: (perfil: PerfilSistema) => void;
  setFuncionarioId: (id: string | null) => void;
  aplicarLoginAdmin: (auth: AdminAuth, funcionarioId?: string | null) => void;
  exigeCodigoFuncionario: boolean;
  podePularCodigoFuncionario: boolean;
  nomeRegistroSistema: string;
  logout: () => void;
};

const SessaoContext = createContext<SessaoContextValue | null>(null);

export function SessaoProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<SessaoPersistida>(readSessao);
  const [adminAuth, setAdminAuth] = useState<AdminAuth | null>(readAdminAuth);

  useEffect(() => {
    if (sessao.logado) {
      persistirSessao(sessao);
    }
  }, [sessao]);

  const aplicarLoginAdmin = useCallback(
    (auth: AdminAuth, funcionarioId?: string | null) => {
      setAdminAuth(auth);
      setSessao({
        ...sessaoFromAdminAuth(auth),
        funcionarioId: funcionarioId ?? undefined,
      });
    },
    [],
  );

  const setPerfil = useCallback((novo: PerfilSistema) => {
    setSessao((atual) => ({
      ...atual,
      perfil: novo,
      logado: atual.logado,
    }));
  }, []);

  const setFuncionarioId = useCallback((id: string | null) => {
    setSessao((atual) => ({
      ...atual,
      funcionarioId: id ?? undefined,
      logado: true,
    }));
  }, []);

  const logout = useCallback(() => {
    clearAllAuth();
    setAdminAuth(null);
    setSessao({ perfil: "dono", logado: false });
    window.location.href = "/loja/minha-conta";
  }, []);

  const nomeRegistroSistema = useMemo(() => {
    if (adminAuth?.user) {
      if (adminAuth.user.role === "PROPRIETARIO") {
        return adminAuth.user.nome || perfilSistemaLabels.dono;
      }
      return adminAuth.user.nome;
    }
    return perfilSistemaLabels[sessao.perfil];
  }, [adminAuth, sessao.perfil]);

  const value = useMemo<SessaoContextValue>(
    () => ({
      perfil: sessao.perfil,
      funcionarioId: sessao.funcionarioId ?? null,
      userId: sessao.userId ?? adminAuth?.user.id ?? null,
      logado: sessao.logado && Boolean(adminAuth?.token),
      adminUser: adminAuth?.user ?? null,
      administrador: administradorMock,
      setPerfil,
      setFuncionarioId,
      aplicarLoginAdmin,
      exigeCodigoFuncionario: calcExigeCodigo(sessao.perfil),
      podePularCodigoFuncionario: sessao.perfil === "dono",
      nomeRegistroSistema,
      logout,
    }),
    [sessao, adminAuth, setPerfil, setFuncionarioId, aplicarLoginAdmin, nomeRegistroSistema, logout],
  );

  return (
    <SessaoContext.Provider value={value}>{children}</SessaoContext.Provider>
  );
}

export function useSessao() {
  const ctx = useContext(SessaoContext);
  if (!ctx) {
    throw new Error("useSessao deve ser usado dentro de SessaoProvider");
  }
  return ctx;
}
