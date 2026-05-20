/** Itens do menu lateral — integração com API fica para o backend */
export const ADMIN_BASE = "/admin";

export const adminRoutes = {
  dashboard: `${ADMIN_BASE}`,
  produtos: `${ADMIN_BASE}/produtos`,
  clientes: `${ADMIN_BASE}/clientes`,
  clientesLista: `${ADMIN_BASE}/clientes/lista`,
  clientesSolicitacoes: `${ADMIN_BASE}/clientes/solicitacoes`,
  estoque: `${ADMIN_BASE}/estoque`,
  estoqueEntrada: `${ADMIN_BASE}/estoque/entrada`,
  estoqueSaida: `${ADMIN_BASE}/estoque/saida`,
  estoqueAdicionar: `${ADMIN_BASE}/estoque/adicionar`,
  estoqueBaixo: `${ADMIN_BASE}/estoque/baixo`,
  requisicoes: `${ADMIN_BASE}/requisicoes`,
  servicos: `${ADMIN_BASE}/servicos`,
  financeiro: `${ADMIN_BASE}/financeiro`,
  cadastros: `${ADMIN_BASE}/cadastros`,
  /** Área do atendente no balcão (catálogo + OS para o mecânico) */
  cadastroAtendimento: `${ADMIN_BASE}/cadastros/atendimento`,
  /** Legado — redireciona para atendimento */
  cadastroProdutos: `${ADMIN_BASE}/cadastros/produtos`,
  cadastroFornecedores: `${ADMIN_BASE}/cadastros/fornecedores`,
  administrativo: `${ADMIN_BASE}/administrativo`,
  configuracoes: `${ADMIN_BASE}/configuracoes`,
  loja: "/loja",
} as const;

