export type Produto = {
  id: string;
  produto: string;
  codigo: string;
  descricao: string;
  fornecedor: string;
  categoria: string;
  valor: string;
  /** Ativo no inventário / cadastro administrativo */
  ativo: boolean;
  /** Exibido na loja (vitrine / catálogo do cliente) */
  visivelLoja: boolean;
  precoCusto: string;
  quantidade: string;
  quantidadeMinima: string;
  codigoBarras: string;
  localizacao: string;
  peso: string;
  dimensoes: string;
  validade: string;
};

export type EstoqueStatus = "estavel" | "baixo" | "critico" | "zerado";
