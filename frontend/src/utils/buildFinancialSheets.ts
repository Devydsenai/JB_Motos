import {
  apuracaoDiaria,
  lancamentos,
  type LancamentoFinanceiro,
} from "@/data/mockFinanceiro";
import {
  solicitacoesMock,
  statusLabels,
  type SolicitacaoCliente,
} from "@/data/mockClientes";

export type FinancialSheetsData = Record<string, (string | number)[][]>;

const entradaHeader = [
  "Data",
  "Descrição",
  "Categoria",
  "Valor (R$)",
  "Status",
  "Origem (sistema)",
];
const saidaHeader = [...entradaHeader];
const fluxoHeader = [
  "Data",
  "Saldo inicial",
  "Entradas",
  "Saídas",
  "Saldo final",
  "Origem",
];
const pagarHeader = [
  "Vencimento",
  "Fornecedor",
  "Descrição",
  "Valor (R$)",
  "Parcela",
  "Status",
  "Origem (sistema)",
];
const receberHeader = [
  "Vencimento",
  "Cliente",
  "Descrição",
  "Valor (R$)",
  "Parcela",
  "Status",
  "Origem (sistema)",
];

function categoriaEntrada(tipo: LancamentoFinanceiro["tipo"]) {
  if (tipo === "pagamento_cliente") return "Cliente / Loja";
  return "Caixa / Receita";
}

function origemLancamento(item: LancamentoFinanceiro) {
  if (item.tipo === "pagamento_cliente") {
    return `Clientes · Pagamento #${item.id}`;
  }
  if (item.tipo === "saida" && item.descricao.includes("Fornecedor")) {
    return `Estoque · Saída #${item.id}`;
  }
  return `Financeiro · Lançamento #${item.id}`;
}

function extrairFornecedor(descricao: string) {
  const match = descricao.match(/Fornecedor\s+([^—]+)/i);
  return match ? match[1].trim() : "Fornecedor";
}

function statusSaida(item: LancamentoFinanceiro) {
  if (item.descricao.toLowerCase().includes("aluguel")) return "Pago";
  if (item.data >= "2026-05-18") return "Pendente";
  return "Pago";
}

function buildEntradasSheet(): (string | number)[][] {
  const itens = lancamentos.filter(
    (l) => l.tipo === "entrada" || l.tipo === "pagamento_cliente",
  );
  const rows = itens.map((item) => [
    item.data,
    item.descricao,
    categoriaEntrada(item.tipo),
    item.valor,
    item.tipo === "pagamento_cliente" ? "Confirmado" : "Confirmado",
    origemLancamento(item),
  ]);
  const last = rows.length + 1;
  return [
    entradaHeader,
    ...rows,
    ["", "TOTAL", "", `=SUM(D2:D${last})`, "", "Dashboard · Financeiro"],
  ];
}

function buildSaidasSheet(): (string | number)[][] {
  const itens = lancamentos.filter((l) => l.tipo === "saida");
  const rows = itens.map((item) => [
    item.data,
    item.descricao,
    item.descricao.includes("Fornecedor") ? "Estoque" : "Despesa",
    item.valor,
    statusSaida(item),
    origemLancamento(item),
  ]);
  const last = rows.length + 1;
  return [
    saidaHeader,
    ...rows,
    ["", "TOTAL", "", `=SUM(D2:D${last})`, "", "Requisições · Estoque"],
  ];
}

function buildFluxoSheet(): (string | number)[][] {
  const rows: (string | number)[][] = [fluxoHeader];
  const saldoInicial = 15000;

  apuracaoDiaria.forEach((dia, index) => {
    const rowNum = index + 2;
    rows.push([
      dia.data,
      index === 0 ? saldoInicial : `=E${rowNum - 1}`,
      dia.faturamento,
      dia.gastoReal,
      `=B${rowNum}+C${rowNum}-D${rowNum}`,
      "Apuração diária · Financeiro",
    ]);
  });

  const last = apuracaoDiaria.length + 1;
  rows.push([
    "",
    "Totais",
    `=SUM(C2:C${last})`,
    `=SUM(D2:D${last})`,
    `=E${last}`,
    "Conectado ao resumo do período",
  ]);

  return rows;
}

function buildContasPagarSheet(): (string | number)[][] {
  const saidas = lancamentos.filter((l) => l.tipo === "saida");
  const rows = saidas.map((item) => [
    item.data,
    extrairFornecedor(item.descricao),
    item.descricao,
    item.valor,
    "1/1",
    statusSaida(item),
    origemLancamento(item),
  ]);

  const last = rows.length + 1;
  return [
    pagarHeader,
    ...rows,
    ["", "TOTAL", "", `=SUM(D2:D${last})`, "", "", "Cadastros · Fornecedores"],
  ];
}

function solicitacaoParaReceber(s: SolicitacaoCliente) {
  const valor =
    s.status === "concluido"
      ? s.tipo === "servico"
        ? 850
        : 420
      : "A definir na loja";

  return [
    s.solicitadoEm,
    s.clienteNome,
    `${s.tipo === "servico" ? "Serviço" : "Peça"}: ${s.descricao}`,
    valor,
    "1/1",
    statusLabels[s.status],
    `Clientes · Solicitação #${s.id}`,
  ] as (string | number)[];
}

function buildContasReceberSheet(): (string | number)[][] {
  const pagos = lancamentos
    .filter((l) => l.tipo === "pagamento_cliente")
    .map((item) => {
      const nomeMatch = item.descricao.match(/Cliente\s+([^(—]+)/i);
      const cliente = nomeMatch ? nomeMatch[1].trim() : "Cliente";
      return [
        item.data,
        cliente,
        item.descricao,
        item.valor,
        "1/1",
        "Recebido na loja",
        origemLancamento(item),
      ] as (string | number)[];
    });

  const abertos = solicitacoesMock
    .filter((s) => s.status !== "concluido")
    .map(solicitacaoParaReceber);

  const rows = [...pagos, ...abertos];
  const last = rows.length + 1;

  return [
    receberHeader,
    ...rows,
    [
      "",
      "TOTAL (valores numéricos)",
      "",
      `=SUM(D2:D${last})`,
      "",
      "",
      "Clientes · Serviços · Loja",
    ],
  ];
}

/**
 * Monta todas as abas da planilha a partir dos dados centrais do JB Motos.
 * Substituir imports por resposta da API quando o backend estiver pronto.
 */
export function buildFinancialSheetsFromSystem(): FinancialSheetsData {
  return {
    Entradas: buildEntradasSheet(),
    Saidas: buildSaidasSheet(),
    FluxoCaixa: buildFluxoSheet(),
    ContasPagar: buildContasPagarSheet(),
    ContasReceber: buildContasReceberSheet(),
  };
}
