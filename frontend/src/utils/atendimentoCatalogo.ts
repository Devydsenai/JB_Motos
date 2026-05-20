import type { EstoqueSaida } from "@/data/mockEstoqueSaidas";
import { getUltimaSaidaPorCodigo } from "@/data/mockEstoqueSaidas";
import type { EstoqueStatus, Produto } from "@/types/produto";
import { getProdutoEstoqueStatus, parseQuantidade } from "@/utils/produtoEstoque";

export type ItemCatalogoAtendimento = {
  produto: Produto;
  statusEstoque: EstoqueStatus;
  disponivelNaLoja: boolean;
  /** Pode abrir OS com peça em mãos */
  podePromoverServico: boolean;
  motivoIndisponivel?: string;
  ultimaSaida?: EstoqueSaida;
};

export type CatalogoAtendimento = {
  disponiveis: ItemCatalogoAtendimento[];
  indisponiveis: ItemCatalogoAtendimento[];
  todos: ItemCatalogoAtendimento[];
};

function buildItem(
  produto: Produto,
  saidas: EstoqueSaida[],
): ItemCatalogoAtendimento {
  const statusEstoque = getProdutoEstoqueStatus(produto);
  const ultimaSaida = getUltimaSaidaPorCodigo(produto.codigo, saidas);
  const qtd = parseQuantidade(produto.quantidade);

  const disponivelNaLoja =
    produto.ativo &&
    produto.visivelLoja &&
    statusEstoque !== "zerado" &&
    qtd > 0;

  const motivos: string[] = [];

  if (!produto.visivelLoja) {
    motivos.push("Fora da vitrine da loja");
  }
  if (statusEstoque === "zerado") {
    motivos.push("Sem estoque no momento");
  } else if (statusEstoque === "critico") {
    motivos.push("Estoque crítico");
  } else if (statusEstoque === "baixo") {
    motivos.push("Estoque baixo");
  }
  if (ultimaSaida) {
    motivos.push(`Última saída: ${ultimaSaida.data}`);
  }

  return {
    produto,
    statusEstoque,
    disponivelNaLoja,
    podePromoverServico: produto.ativo && qtd > 0,
    motivoIndisponivel:
      !disponivelNaLoja && motivos.length > 0
        ? motivos.join(" · ")
        : undefined,
    ultimaSaida,
  };
}

export function buildCatalogoAtendimento(
  produtos: Produto[],
  saidas: EstoqueSaida[] = [],
): CatalogoAtendimento {
  const termoBase = produtos.filter((p) => p.ativo);

  const todos = termoBase.map((p) => buildItem(p, saidas));
  const disponiveis = todos.filter((i) => i.disponivelNaLoja);
  const indisponiveis = todos.filter((i) => !i.disponivelNaLoja);

  return { disponiveis, indisponiveis, todos };
}

export function filtrarCatalogoPorBusca(
  itens: ItemCatalogoAtendimento[],
  busca: string,
): ItemCatalogoAtendimento[] {
  const termo = busca.trim().toLowerCase();
  if (!termo) return itens;

  return itens.filter(({ produto }) => {
    return (
      produto.produto.toLowerCase().includes(termo) ||
      produto.codigo.toLowerCase().includes(termo) ||
      produto.categoria.toLowerCase().includes(termo)
    );
  });
}
