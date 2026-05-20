export type StatusFornecedor = "ativo" | "inativo" | "pendente" | "critico";

export type Fornecedor = {
  id: string;
  codigo: string;
  nome: string;
  cnpj: string;
  tipo: string;
  categoria: string;
  fornecedorDesde: string;
  contato: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  condicoesPagamento: string;
  condicoesPagamento2: string;
  observacoes: string;
  status: StatusFornecedor;
  qtdProdutos: number;
  documentoNome?: string;
};
