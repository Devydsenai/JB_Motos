import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fornecedoresMock } from "@/data/mockFornecedores";
import type { Fornecedor, StatusFornecedor } from "@/types/fornecedor";

const STORAGE_KEY = "jb-motos-fornecedores";

function readFornecedores(): Fornecedor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fornecedoresMock;
    const parsed = JSON.parse(raw) as Fornecedor[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fornecedoresMock;
  } catch {
    return fornecedoresMock;
  }
}

export const fornecedorInicial: Fornecedor = {
  id: "",
  codigo: "",
  nome: "",
  cnpj: "",
  tipo: "",
  categoria: "",
  fornecedorDesde: "",
  contato: "",
  email: "",
  telefone: "",
  endereco: "",
  cidade: "",
  estado: "",
  condicoesPagamento: "",
  condicoesPagamento2: "",
  observacoes: "",
  status: "pendente",
  qtdProdutos: 0,
  documentoNome: "",
};

type FornecedoresContextValue = {
  fornecedores: Fornecedor[];
  setFornecedores: React.Dispatch<React.SetStateAction<Fornecedor[]>>;
  salvarFornecedor: (fornecedor: Fornecedor, editandoId: string | null) => void;
  excluirFornecedor: (id: string) => void;
  alternarStatusFornecedor: (id: string) => void;
};

const FornecedoresContext = createContext<FornecedoresContextValue | null>(null);

const STATUS_CYCLE: StatusFornecedor[] = [
  "ativo",
  "pendente",
  "critico",
  "inativo",
];

export function FornecedoresProvider({ children }: { children: ReactNode }) {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(readFornecedores);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fornecedores));
    } catch {
      /* ignore */
    }
  }, [fornecedores]);

  const salvarFornecedor = useCallback(
    (fornecedor: Fornecedor, editandoId: string | null) => {
      if (editandoId) {
        setFornecedores((atuais) =>
          atuais.map((f) => (f.id === editandoId ? fornecedor : f)),
        );
      } else {
        setFornecedores((atuais) => [fornecedor, ...atuais]);
      }
    },
    [],
  );

  const excluirFornecedor = useCallback((id: string) => {
    setFornecedores((atuais) => atuais.filter((f) => f.id !== id));
  }, []);

  const alternarStatusFornecedor = useCallback((id: string) => {
    setFornecedores((atuais) =>
      atuais.map((f) => {
        if (f.id !== id) return f;
        const idx = STATUS_CYCLE.indexOf(f.status);
        const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
        return { ...f, status: next };
      }),
    );
  }, []);

  const value = useMemo(
    () => ({
      fornecedores,
      setFornecedores,
      salvarFornecedor,
      excluirFornecedor,
      alternarStatusFornecedor,
    }),
    [
      fornecedores,
      salvarFornecedor,
      excluirFornecedor,
      alternarStatusFornecedor,
    ],
  );

  return (
    <FornecedoresContext.Provider value={value}>
      {children}
    </FornecedoresContext.Provider>
  );
}

export function useFornecedores() {
  const ctx = useContext(FornecedoresContext);
  if (!ctx) {
    throw new Error(
      "useFornecedores deve ser usado dentro de FornecedoresProvider",
    );
  }
  return ctx;
}
