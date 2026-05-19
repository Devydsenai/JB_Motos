/** Itens do menu lateral — integração com API fica para o backend */
export const ADMIN_BASE = "/admin";

export const adminRoutes = {
  dashboard: `${ADMIN_BASE}`,
  produtos: `${ADMIN_BASE}/produtos`,
  estoque: `${ADMIN_BASE}/estoque`,
  estoqueEntrada: `${ADMIN_BASE}/estoque/entrada`,
  estoqueSaida: `${ADMIN_BASE}/estoque/saida`,
  estoqueAdicionar: `${ADMIN_BASE}/estoque/adicionar`,
  requisicoes: `${ADMIN_BASE}/requisicoes`,
  servicos: `${ADMIN_BASE}/servicos`,
  financeiro: `${ADMIN_BASE}/financeiro`,
  cadastros: `${ADMIN_BASE}/cadastros`,
  cadastroProdutos: `${ADMIN_BASE}/cadastros/produtos`,
  cadastroFornecedores: `${ADMIN_BASE}/cadastros/fornecedores`,
  administrativo: `${ADMIN_BASE}/administrativo`,
  loja: "/loja",
} as const;

/** Mock: alertas de estoque baixo até o backend conectar */
export const MOCK_ALERTAS_ESTOQUE = 3;
