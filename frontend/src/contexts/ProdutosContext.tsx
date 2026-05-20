import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { produtosMock } from "@/data/mockProdutos";
import type { Produto } from "@/types/produto";
import { getProdutoEstoqueStatus } from "@/utils/produtoEstoque";

const STORAGE_KEY = "jb-motos-produtos";

export const produtoInicial: Produto = {
  id: "",
  produto: "",
  codigo: "",
  descricao: "",
  fornecedor: "",
  categoria: "",
  valor: "",
  ativo: true,
  visivelLoja: false,
  precoCusto: "",
  quantidade: "",
  quantidadeMinima: "",
  codigoBarras: "",
  localizacao: "",
  peso: "",
  dimensoes: "",
  validade: "",
};

function readStoredProdutos(): Produto[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return produtosMock;
    const parsed = JSON.parse(raw) as Produto[];
    if (!Array.isArray(parsed) || parsed.length === 0) return produtosMock;
    return parsed.map((item) => ({
      ...item,
      visivelLoja: Boolean(item.visivelLoja),
      ativo: item.ativo !== false,
    }));
  } catch {
    return produtosMock;
  }
}

type ProdutosContextValue = {
  produtos: Produto[];
  setProdutos: React.Dispatch<React.SetStateAction<Produto[]>>;
  toggleVisivelLoja: (id: string) => void;
  setVisivelLoja: (id: string, visivel: boolean) => void;
  inativarNaLojaPorEstoqueBaixo: () => number;
};

const ProdutosContext = createContext<ProdutosContextValue | null>(null);

export function ProdutosProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>(readStoredProdutos);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
    } catch {
      /* ignore */
    }
  }, [produtos]);

  const toggleVisivelLoja = useCallback((id: string) => {
    setProdutos((atuais) =>
      atuais.map((p) =>
        p.id === id ? { ...p, visivelLoja: !p.visivelLoja } : p,
      ),
    );
  }, []);

  const setVisivelLoja = useCallback((id: string, visivel: boolean) => {
    setProdutos((atuais) =>
      atuais.map((p) => (p.id === id ? { ...p, visivelLoja: visivel } : p)),
    );
  }, []);

  const inativarNaLojaPorEstoqueBaixo = useCallback(() => {
    let count = 0;
    setProdutos((atuais) =>
      atuais.map((p) => {
        const status = getProdutoEstoqueStatus(p);
        if (
          p.visivelLoja &&
          (status === "baixo" || status === "critico" || status === "zerado")
        ) {
          count += 1;
          return { ...p, visivelLoja: false };
        }
        return p;
      }),
    );
    return count;
  }, []);

  const value = useMemo(
    () => ({
      produtos,
      setProdutos,
      toggleVisivelLoja,
      setVisivelLoja,
      inativarNaLojaPorEstoqueBaixo,
    }),
    [
      produtos,
      toggleVisivelLoja,
      setVisivelLoja,
      inativarNaLojaPorEstoqueBaixo,
    ],
  );

  return (
    <ProdutosContext.Provider value={value}>{children}</ProdutosContext.Provider>
  );
}

export function useProdutos() {
  const ctx = useContext(ProdutosContext);
  if (!ctx) {
    throw new Error("useProdutos deve ser usado dentro de ProdutosProvider");
  }
  return ctx;
}
