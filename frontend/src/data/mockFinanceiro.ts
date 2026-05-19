/** Dados de demonstração — substituir por API do backend */

export type LancamentoFinanceiro = {
  id: string;
  data: string;
  descricao: string;
  tipo: "entrada" | "saida" | "pagamento_cliente";
  valor: number;
};

export type ApuracaoDiaria = {
  data: string;
  faturamento: number;
  gastoReal: number;
  lucroApurado: number;
};

/** Últimos 7 dias — apuração da loja */
export const apuracaoDiaria: ApuracaoDiaria[] = [
  { data: "2026-05-12", faturamento: 4200, gastoReal: 1850, lucroApurado: 2350 },
  { data: "2026-05-13", faturamento: 5100, gastoReal: 2100, lucroApurado: 3000 },
  { data: "2026-05-14", faturamento: 3800, gastoReal: 1920, lucroApurado: 1880 },
  { data: "2026-05-15", faturamento: 6200, gastoReal: 2450, lucroApurado: 3750 },
  { data: "2026-05-16", faturamento: 4900, gastoReal: 2200, lucroApurado: 2700 },
  { data: "2026-05-17", faturamento: 5500, gastoReal: 1980, lucroApurado: 3520 },
  { data: "2026-05-18", faturamento: 4800, gastoReal: 2050, lucroApurado: 2750 },
];

/** Pagamentos registrados (cliente na loja, fornecedores, etc.) */
export const lancamentos: LancamentoFinanceiro[] = [
  {
    id: "1",
    data: "2026-05-18",
    descricao: "Pagamento peças — Cliente João (OS #1042)",
    tipo: "pagamento_cliente",
    valor: 850,
  },
  {
    id: "2",
    data: "2026-05-18",
    descricao: "Fornecedor Motopeças — NF 8821",
    tipo: "saida",
    valor: 1200,
  },
  {
    id: "3",
    data: "2026-05-17",
    descricao: "Pagamento serviço — Cliente Maria",
    tipo: "pagamento_cliente",
    valor: 420,
  },
  {
    id: "4",
    data: "2026-05-17",
    descricao: "Entrada caixa — vendas balcão",
    tipo: "entrada",
    valor: 2100,
  },
  {
    id: "5",
    data: "2026-05-16",
    descricao: "Pagamento peças — Cliente Pedro",
    tipo: "pagamento_cliente",
    valor: 630,
  },
  {
    id: "6",
    data: "2026-05-16",
    descricao: "Aluguel galpão (parcela)",
    tipo: "saida",
    valor: 2800,
  },
];
