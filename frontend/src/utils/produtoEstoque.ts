import type { EstoqueStatus, Produto } from "@/types/produto";

export function parseQuantidade(valor: string): number {
  const n = Number(String(valor).replace(",", ".").trim());
  return Number.isFinite(n) ? n : 0;
}

export function getEstoqueStatus(
  quantidade: number,
  quantidadeMinima: number,
): EstoqueStatus {
  if (quantidade <= 0) return "zerado";
  if (quantidade <= quantidadeMinima * 0.5) return "critico";
  if (quantidade <= quantidadeMinima) return "baixo";
  return "estavel";
}

export function getProdutoEstoqueStatus(produto: Produto): EstoqueStatus {
  return getEstoqueStatus(
    parseQuantidade(produto.quantidade),
    parseQuantidade(produto.quantidadeMinima),
  );
}

export const estoqueStatusLabels: Record<EstoqueStatus, string> = {
  estavel: "Estável",
  baixo: "Estoque baixo",
  critico: "Crítico",
  zerado: "Sem estoque",
};

const ordemAlerta: Record<EstoqueStatus, number> = {
  zerado: 0,
  critico: 1,
  baixo: 2,
  estavel: 99,
};

export type ProdutoComStatusEstoque = Produto & { statusEstoque: EstoqueStatus };

export function isProdutoEstoqueAlerta(produto: Produto): boolean {
  return getProdutoEstoqueStatus(produto) !== "estavel";
}

/** Produtos ativos com estoque baixo, crítico ou zerado */
export function listarProdutosEstoqueBaixo(
  produtos: Produto[],
): ProdutoComStatusEstoque[] {
  return produtos
    .filter((p) => p.ativo)
    .map((p) => ({
      ...p,
      statusEstoque: getProdutoEstoqueStatus(p),
    }))
    .filter((p) => p.statusEstoque !== "estavel")
    .sort(
      (a, b) => ordemAlerta[a.statusEstoque] - ordemAlerta[b.statusEstoque],
    );
}
