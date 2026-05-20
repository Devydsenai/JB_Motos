/** Movimentações de saída — mesma base da tela Estoque → Saída */
export type EstoqueSaida = {
  id: string;
  data: string;
  produto: string;
  codigo: string;
  quantidade: string;
  estoqueAtual: string;
  servico: string;
  moto: string;
  responsavel: string;
  motivo: string;
};

export const estoqueSaidasMock: EstoqueSaida[] = [
  {
    id: "sai-001",
    data: "29/04/2025 15:57",
    produto: "Pastilha de Freio",
    codigo: "PRD-002",
    quantidade: "-2",
    estoqueAtual: "5",
    servico: "Troca de pastilha de freio",
    moto: "Honda CG 160",
    responsavel: "Mecânico Carlos",
    motivo: "Serviço concluído",
  },
  {
    id: "sai-002",
    data: "29/04/2025 13:40",
    produto: "Óleo Motor 10W30",
    codigo: "PRD-001",
    quantidade: "-1",
    estoqueAtual: "48",
    servico: "Troca de óleo",
    moto: "Yamaha Fazer 250",
    responsavel: "Mecânico Paulo",
    motivo: "Serviço concluído",
  },
  {
    id: "sai-003",
    data: "28/04/2025 17:12",
    produto: "Kit Relação CG 160",
    codigo: "PRD-005",
    quantidade: "-1",
    estoqueAtual: "18",
    servico: "Substituição de relação",
    moto: "Honda CG 160",
    responsavel: "Mecânico Carlos",
    motivo: "Serviço concluído",
  },
  {
    id: "sai-004",
    data: "27/04/2025 11:20",
    produto: "Filtro de Ar",
    codigo: "PRD-006",
    quantidade: "-7",
    estoqueAtual: "3",
    servico: "Revisão preventiva",
    moto: "Honda Biz 125",
    responsavel: "Mecânico Paulo",
    motivo: "Serviço concluído",
  },
  {
    id: "sai-005",
    data: "26/04/2025 16:05",
    produto: "Pneu Traseiro 90/90",
    codigo: "PRD-003",
    quantidade: "-1",
    estoqueAtual: "12",
    servico: "Troca de pneu",
    moto: "Yamaha Fazer 250",
    responsavel: "Mecânico Carlos",
    motivo: "Serviço concluído",
  },
];

export function getUltimaSaidaPorCodigo(
  codigo: string,
  saidas = estoqueSaidasMock,
): EstoqueSaida | undefined {
  return saidas.find((s) => s.codigo === codigo);
}
