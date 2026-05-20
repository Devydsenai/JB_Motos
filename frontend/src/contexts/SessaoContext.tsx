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
import type { PerfilFuncionario } from "@/types/funcionario";

const STORAGE_PERFIL = "jb-motos-perfil-sistema";
const STORAGE_SESSAO = "jb-motos-sessao";

const FUNCIONARIO_PADRAO: Record<PerfilFuncionario, string> = {
  atendente: "func-003",
  mecanico: "func-002",
};

type SessaoPersistida = {
  perfil: PerfilSistema;
  funcionarioId?: string;
  logado: boolean;
};

function readSessao(): SessaoPersistida {
  try {
    const raw = localStorage.getItem(STORAGE_SESSAO);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SessaoPersistida>;
      const perfil = parsed.perfil;
      if (perfil === "atendente" || perfil === "mecanico" || perfil === "dono") {
        return {
          perfil,
          funcionarioId: parsed.funcionarioId,
          logado: parsed.logado !== false,
        };
      }
    }
  } catch {
    /* ignore */
  }

  const legado = localStorage.getItem(STORAGE_PERFIL);
  const perfil =
    legado === "atendente" || legado === "mecanico" || legado === "dono"
      ? legado
      : "dono";

  return {
    perfil,
    funcionarioId:
      perfil === "atendente"
        ? FUNCIONARIO_PADRAO.atendente
        : perfil === "mecanico"
          ? FUNCIONARIO_PADRAO.mecanico
          : undefined,
    logado: true,
  };
}

function persistirSessao(sessao: SessaoPersistida) {
  try {
    localStorage.setItem(STORAGE_SESSAO, JSON.stringify(sessao));
    localStorage.setItem(STORAGE_PERFIL, sessao.perfil);
  } catch {
    /* ignore */
  }
}

type SessaoContextValue = {
  perfil: PerfilSistema;
  funcionarioId: string | null;
  logado: boolean;
  administrador: typeof administradorMock;
  setPerfil: (perfil: PerfilSistema) => void;
  setFuncionarioId: (id: string | null) => void;
  exigeCodigoFuncionario: boolean;
  podePularCodigoFuncionario: boolean;
  nomeRegistroSistema: string;
  logout: () => void;
};

const SessaoContext = createContext<SessaoContextValue | null>(null);

export function SessaoProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<SessaoPersistida>(readSessao);

  useEffect(() => {
    persistirSessao(sessao);
  }, [sessao]);

  const setPerfil = useCallback((novo: PerfilSistema) => {
    setSessao(() => ({
      perfil: novo,
      logado: true,
      funcionarioId:
        novo === "atendente"
          ? FUNCIONARIO_PADRAO.atendente
          : novo === "mecanico"
            ? FUNCIONARIO_PADRAO.mecanico
            : undefined,
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
    try {
      localStorage.removeItem(STORAGE_SESSAO);
      localStorage.removeItem(STORAGE_PERFIL);
    } catch {
      /* ignore */
    }
    window.location.href = "/loja";
  }, []);

  const value = useMemo<SessaoContextValue>(
    () => ({
      perfil: sessao.perfil,
      funcionarioId: sessao.funcionarioId ?? null,
      logado: sessao.logado,
      administrador: administradorMock,
      setPerfil,
      setFuncionarioId,
      exigeCodigoFuncionario: calcExigeCodigo(sessao.perfil),
      podePularCodigoFuncionario: sessao.perfil === "dono",
      nomeRegistroSistema: perfilSistemaLabels.dono,
      logout,
    }),
    [sessao, setPerfil, setFuncionarioId, logout],
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
