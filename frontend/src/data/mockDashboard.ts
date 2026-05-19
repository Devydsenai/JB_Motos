export type PeriodoFiltro = "hoje" | "semana" | "dia" | "mes";

export type KpiCard = {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: string;
  iconBg: string;
};

export type PontoGrafico = {
  label: string;
  atual: number;
  referencia: number;
};

export type CategoriaLoja = {
  id: string;
  label: string;
  percentual: number;
  cor: string;
  icon: string;
  valor: string;
  hint?: string;
};

export type AtividadeRecente = {
  id: string;
  titulo: string;
  descricao: string;
  tempo: string;
  icon: string;
  cor: string;
  fundo: string;
};

export type StatusEstoque = "estavel" | "atencao" | "critico";

export type ProdutoEstoqueDashboard = {
  id: string;
  produto: string;
  codigo: string;
  categoria: string;
  estoque: number;
  estoqueMaximo: number;
  status: StatusEstoque;
  icon: string;
  cor: string;
  fundo: string;
};

/** Ordem no grid 2×2: saída | entrada / serviços | em espera */
export const categoriasBase: Omit<CategoriaLoja, "valor" | "hint">[] = [
  {
    id: "saida",
    label: "Saída",
    percentual: 28,
    cor: "#c41e1e",
    icon: "box-arrow-up",
  },
  {
    id: "entrada",
    label: "Entrada",
    percentual: 32,
    cor: "#16a34a",
    icon: "box-arrow-in-down",
  },
  {
    id: "servicos",
    label: "Serviços",
    percentual: 25,
    cor: "#f97316",
    icon: "tools",
  },
  {
    id: "espera",
    label: "Em espera",
    percentual: 15,
    cor: "#8b5cf6",
    icon: "hourglass-split",
  },
];

const kpisPorPeriodo: Record<PeriodoFiltro, KpiCard[]> = {
  hoje: [
    {
      id: "saida",
      label: "Saída de estoque",
      value: "24",
      trend: "+3 vs ontem",
      trendUp: true,
      icon: "box-arrow-up",
      iconBg: "#fee2e2",
    },
    {
      id: "entrada",
      label: "Entrada de estoque",
      value: "18",
      trend: "+2 vs ontem",
      trendUp: true,
      icon: "box-arrow-in-down",
      iconBg: "#dcfce7",
    },
    {
      id: "servicos",
      label: "Serviços",
      value: "12",
      trend: "5 em andamento",
      trendUp: true,
      icon: "tools",
      iconBg: "#f3f4f6",
    },
    {
      id: "espera",
      label: "Em espera",
      value: "7",
      trend: "2 pendentes fim de semana",
      trendUp: false,
      icon: "hourglass-split",
      iconBg: "#fef3c7",
    },
  ],
  dia: [
    {
      id: "saida",
      label: "Saída de estoque",
      value: "156",
      trend: "+8% vs dia anterior",
      trendUp: true,
      icon: "box-arrow-up",
      iconBg: "#fee2e2",
    },
    {
      id: "entrada",
      label: "Entrada de estoque",
      value: "142",
      trend: "+5% vs dia anterior",
      trendUp: true,
      icon: "box-arrow-in-down",
      iconBg: "#dcfce7",
    },
    {
      id: "servicos",
      label: "Serviços",
      value: "89",
      trend: "12 concluídos hoje",
      trendUp: true,
      icon: "tools",
      iconBg: "#f3f4f6",
    },
    {
      id: "espera",
      label: "Em espera",
      value: "23",
      trend: "↓ 4% vs dia anterior",
      trendUp: false,
      icon: "hourglass-split",
      iconBg: "#fef3c7",
    },
  ],
  semana: [
    {
      id: "saida",
      label: "Saída de estoque",
      value: "892",
      trend: "+11% vs semana passada",
      trendUp: true,
      icon: "box-arrow-up",
      iconBg: "#fee2e2",
    },
    {
      id: "entrada",
      label: "Entrada de estoque",
      value: "910",
      trend: "+9% vs semana passada",
      trendUp: true,
      icon: "box-arrow-in-down",
      iconBg: "#dcfce7",
    },
    {
      id: "servicos",
      label: "Serviços",
      value: "534",
      trend: "68 concluídos",
      trendUp: true,
      icon: "tools",
      iconBg: "#f3f4f6",
    },
    {
      id: "espera",
      label: "Em espera",
      value: "41",
      trend: "↑ 6 novos na fila",
      trendUp: false,
      icon: "hourglass-split",
      iconBg: "#fef3c7",
    },
  ],
  mes: [
    {
      id: "saida",
      label: "Saída de estoque",
      value: "3.240",
      trend: "+12% vs mês anterior",
      trendUp: true,
      icon: "box-arrow-up",
      iconBg: "#fee2e2",
    },
    {
      id: "entrada",
      label: "Entrada de estoque",
      value: "3.580",
      trend: "+10% vs mês anterior",
      trendUp: true,
      icon: "box-arrow-in-down",
      iconBg: "#dcfce7",
    },
    {
      id: "servicos",
      label: "Serviços",
      value: "2.180",
      trend: "312 concluídos",
      trendUp: true,
      icon: "tools",
      iconBg: "#f3f4f6",
    },
    {
      id: "espera",
      label: "Em espera",
      value: "128",
      trend: "↓ 3% vs mês anterior",
      trendUp: true,
      icon: "hourglass-split",
      iconBg: "#fef3c7",
    },
  ],
};

const graficoPorPeriodo: Record<PeriodoFiltro, PontoGrafico[]> = {
  hoje: [
    { label: "8h", atual: 2, referencia: 3 },
    { label: "10h", atual: 5, referencia: 4 },
    { label: "12h", atual: 8, referencia: 7 },
    { label: "14h", atual: 12, referencia: 10 },
    { label: "16h", atual: 18, referencia: 14 },
    { label: "18h", atual: 24, referencia: 20 },
  ],
  dia: [
    { label: "Seg", atual: 120, referencia: 110 },
    { label: "Ter", atual: 135, referencia: 125 },
    { label: "Qua", atual: 142, referencia: 130 },
    { label: "Qui", atual: 128, referencia: 135 },
    { label: "Sex", atual: 156, referencia: 140 },
  ],
  semana: [
    { label: "S1", atual: 620, referencia: 580 },
    { label: "S2", atual: 710, referencia: 650 },
    { label: "S3", atual: 805, referencia: 720 },
    { label: "S4", atual: 892, referencia: 800 },
  ],
  mes: [
    { label: "Jan", atual: 2100, referencia: 2000 },
    { label: "Fev", atual: 2450, referencia: 2200 },
    { label: "Mar", atual: 2680, referencia: 2500 },
    { label: "Abr", atual: 2890, referencia: 2700 },
    { label: "Mai", atual: 3120, referencia: 2900 },
    { label: "Jun", atual: 3240, referencia: 3000 },
  ],
};

export const atividadesRecentes: AtividadeRecente[] = [
  {
    id: "carrinho",
    titulo: "Carrinho iniciado",
    descricao: "Cliente adicionou itens para compra",
    tempo: "12 min atrás",
    icon: "cart3",
    cor: "#16a34a",
    fundo: "#dcfce7",
  },
  {
    id: "saida",
    titulo: "Saída registrada",
    descricao: "Óleo 10W30 - venda balcão",
    tempo: "45 min atrás",
    icon: "box-arrow-up",
    cor: "#c41e1e",
    fundo: "#fee2e2",
  },
  {
    id: "servico",
    titulo: "Serviço em andamento",
    descricao: "Troca de relação - Honda CG",
    tempo: "2 horas atrás",
    icon: "tools",
    cor: "#f97316",
    fundo: "#ffedd5",
  },
  {
    id: "espera",
    titulo: "Peça em espera",
    descricao: "Pastilha de freio aguardando entrada",
    tempo: "1 dia atrás",
    icon: "hourglass-split",
    cor: "#8b5cf6",
    fundo: "#ede9fe",
  },
];

export const statusEstoqueDashboard: ProdutoEstoqueDashboard[] = [
  {
    id: "prd-001",
    produto: "Óleo Motor 10W30",
    codigo: "PRD-001",
    categoria: "Lubrificantes",
    estoque: 48,
    estoqueMaximo: 60,
    status: "estavel",
    icon: "droplet-fill",
    cor: "#16a34a",
    fundo: "#dcfce7",
  },
  {
    id: "prd-002",
    produto: "Pastilha de Freio",
    codigo: "PRD-002",
    categoria: "Freios",
    estoque: 5,
    estoqueMaximo: 50,
    status: "critico",
    icon: "box-seam",
    cor: "#c41e1e",
    fundo: "#fee2e2",
  },
  {
    id: "prd-003",
    produto: "Pneu Traseiro 90/90",
    codigo: "PRD-003",
    categoria: "Pneus",
    estoque: 12,
    estoqueMaximo: 40,
    status: "atencao",
    icon: "circle",
    cor: "#f97316",
    fundo: "#ffedd5",
  },
  {
    id: "prd-004",
    produto: "Capacete Pro Tork",
    codigo: "PRD-004",
    categoria: "Acessórios",
    estoque: 32,
    estoqueMaximo: 45,
    status: "estavel",
    icon: "shield-fill-check",
    cor: "#16a34a",
    fundo: "#dcfce7",
  },
];

export function getCategoriasComValores(periodo: PeriodoFiltro): CategoriaLoja[] {
  const kpis = kpisPorPeriodo[periodo];
  return categoriasBase.map((cat) => {
    const kpi = kpis.find((k) => k.id === cat.id);
    return {
      ...cat,
      valor: kpi?.value ?? "—",
      hint: kpi?.trend,
    };
  });
}

export function getDashboardData(periodo: PeriodoFiltro) {
  return {
    kpis: kpisPorPeriodo[periodo],
    grafico: graficoPorPeriodo[periodo],
    categorias: getCategoriasComValores(periodo),
    atividades: atividadesRecentes,
    statusEstoque: statusEstoqueDashboard,
  };
}

export const periodoLabels: Record<PeriodoFiltro, string> = {
  hoje: "Hoje",
  semana: "Semana",
  dia: "Dia",
  mes: "Mês",
};
