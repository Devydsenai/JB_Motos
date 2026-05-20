import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { funcionariosMock } from "@/data/mockFuncionarios";
import type { Funcionario, PerfilFuncionario } from "@/types/funcionario";
import {
  formatarCodigoServico,
  isCodigoServicoValido,
  normalizarCodigoServico,
} from "@/utils/funcionarioCodigo";

const STORAGE_KEY = "jb-motos-funcionarios";

function mockPorId(id: string) {
  return funcionariosMock.find((m) => m.id === id);
}

function normalizeFuncionario(
  raw: Partial<Funcionario> & { perfil?: string },
): Funcionario | null {
  if ((raw.perfil as string | undefined) === "administrativo") return null;

  const perfil = raw.perfil === "mecanico" ? "mecanico" : "atendente";
  const ref = raw.id ? mockPorId(raw.id) : undefined;
  const codigoRaw = raw.codigoServico ?? ref?.codigoServico ?? "";

  return {
    ...funcionarioInicial,
    ...ref,
    ...raw,
    id: raw.id ?? `func-${Date.now()}`,
    perfil,
    codigoServico: codigoRaw ? formatarCodigoServico(codigoRaw) : "",
    fotoUrl: raw.fotoUrl ?? ref?.fotoUrl ?? "",
    cpf: raw.cpf ?? ref?.cpf ?? "",
    dataDemissao: raw.dataDemissao ?? "",
    motivoDemissao: raw.motivoDemissao ?? "",
    ativo: raw.ativo ?? ref?.ativo ?? true,
  } as Funcionario;
}

function readFuncionarios(): Funcionario[] {
  try {
    const byId = new Map<string, Funcionario>();
    for (const mock of funcionariosMock) {
      const n = normalizeFuncionario(mock);
      if (n) byId.set(n.id, n);
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as (Partial<Funcionario> & {
        perfil?: string;
      })[];
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          const n = normalizeFuncionario(item);
          if (n) byId.set(n.id, n);
        }
      }
    }

    const lista = Array.from(byId.values());
    return lista.length > 0 ? lista : [...funcionariosMock];
  } catch {
    return [...funcionariosMock];
  }
}

/** Lista unificada mock + cadastros para busca por código */
function fontesParaBuscaCodigo(atuais: Funcionario[]): Funcionario[] {
  const byId = new Map<string, Funcionario>();
  for (const f of funcionariosMock) {
    const n = normalizeFuncionario(f);
    if (n) byId.set(n.id, n);
  }
  for (const f of atuais) {
    const n = normalizeFuncionario(f);
    if (n) byId.set(n.id, n);
  }
  return Array.from(byId.values());
}

export const funcionarioInicial: Funcionario = {
  id: "",
  codigoServico: "",
  nome: "",
  sobrenome: "",
  email: "",
  fotoUrl: "",
  cpf: "",
  senha: "",
  perfil: "atendente",
  salarioBruto: "",
  dataAdmissao: "",
  dataDemissao: "",
  motivoDemissao: "",
  feriasInicio: "",
  feriasFim: "",
  cnh: "",
  cnhValidade: "",
  diaCicloMenstrual: "",
  gestante: false,
  dataPrevisaoParto: "",
  acidente: false,
  acidenteData: "",
  acidenteDescricao: "",
  avisoPrevio: false,
  avisoPrevioInicio: "",
  avisoPrevioFim: "",
  statusRh: "ativo",
  ativo: true,
};

type FuncionariosContextValue = {
  funcionarios: Funcionario[];
  salvarFuncionario: (f: Funcionario, editandoId: string | null) => void;
  demitirFuncionario: (
    id: string,
    dataDemissao: string,
    motivoDemissao: string,
  ) => Funcionario | null;
  excluirFuncionario: (id: string) => void;
  buscarPorCodigoServico: (
    codigo: string,
    perfis?: PerfilFuncionario[],
  ) => Funcionario | null;
  codigoServicoEmUso: (codigo: string, ignorarId?: string) => boolean;
};

const FuncionariosContext = createContext<FuncionariosContextValue | null>(null);

export function FuncionariosProvider({ children }: { children: ReactNode }) {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(readFuncionarios);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(funcionarios));
    } catch {
      /* ignore */
    }
  }, [funcionarios]);

  const salvarFuncionario = useCallback(
    (funcionario: Funcionario, editandoId: string | null) => {
      if (editandoId) {
        setFuncionarios((atuais) =>
          atuais.map((f) => (f.id === editandoId ? funcionario : f)),
        );
      } else {
        setFuncionarios((atuais) => [funcionario, ...atuais]);
      }
    },
    [],
  );

  const demitirFuncionario = useCallback(
    (id: string, dataDemissao: string, motivoDemissao: string) => {
      let demitido: Funcionario | null = null;
      setFuncionarios((atuais) =>
        atuais.map((f) => {
          if (f.id !== id) return f;
          demitido = {
            ...f,
            dataDemissao,
            motivoDemissao,
            ativo: false,
            statusRh: "demitido",
          };
          return demitido;
        }),
      );
      return demitido;
    },
    [],
  );

  const excluirFuncionario = useCallback((id: string) => {
    setFuncionarios((atuais) => atuais.filter((f) => f.id !== id));
  }, []);

  const buscarPorCodigoServico = useCallback(
    (codigo: string, perfis?: PerfilFuncionario[]) => {
      const normalizado = normalizarCodigoServico(codigo);
      if (!isCodigoServicoValido(normalizado)) return null;

      const fontes = fontesParaBuscaCodigo(funcionarios);
      return (
        fontes.find((f) => {
          if (!f.ativo) return false;
          if (normalizarCodigoServico(f.codigoServico) !== normalizado) {
            return false;
          }
          if (perfis && perfis.length > 0 && !perfis.includes(f.perfil)) {
            return false;
          }
          return true;
        }) ?? null
      );
    },
    [funcionarios],
  );

  const codigoServicoEmUso = useCallback(
    (codigo: string, ignorarId?: string) => {
      const normalizado = normalizarCodigoServico(codigo);
      return funcionarios.some(
        (f) =>
          f.id !== ignorarId &&
          normalizarCodigoServico(f.codigoServico) === normalizado,
      );
    },
    [funcionarios],
  );

  const value = useMemo(
    () => ({
      funcionarios,
      salvarFuncionario,
      demitirFuncionario,
      excluirFuncionario,
      buscarPorCodigoServico,
      codigoServicoEmUso,
    }),
    [
      funcionarios,
      salvarFuncionario,
      demitirFuncionario,
      excluirFuncionario,
      buscarPorCodigoServico,
      codigoServicoEmUso,
    ],
  );

  return (
    <FuncionariosContext.Provider value={value}>
      {children}
    </FuncionariosContext.Provider>
  );
}

export function useFuncionarios() {
  const ctx = useContext(FuncionariosContext);
  if (!ctx) {
    throw new Error(
      "useFuncionarios deve ser usado dentro de FuncionariosProvider",
    );
  }
  return ctx;
}
