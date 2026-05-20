export type FinancialSheetId =
  | "entradas"
  | "saidas"
  | "fluxo"
  | "pagar"
  | "receber";

export type FinancialSheetMeta = {
  id: FinancialSheetId;
  label: string;
  sheetName: string;
  description: string;
};

export const financialSheetsMeta: FinancialSheetMeta[] = [
  {
    id: "entradas",
    label: "Entradas",
    sheetName: "Entradas",
    description: "Receitas e entradas de caixa",
  },
  {
    id: "saidas",
    label: "Saídas",
    sheetName: "Saidas",
    description: "Despesas e pagamentos",
  },
  {
    id: "fluxo",
    label: "Fluxo de caixa",
    sheetName: "FluxoCaixa",
    description: "Consolidado diário com fórmulas",
  },
  {
    id: "pagar",
    label: "Contas a pagar",
    sheetName: "ContasPagar",
    description: "Fornecedores e parcelamentos",
  },
  {
    id: "receber",
    label: "Contas a receber",
    sheetName: "ContasReceber",
    description: "Clientes e recebimentos",
  },
];

/**
 * Dados estáticos de exemplo (legado).
 * A planilha usa `buildFinancialSheetsFromSystem()` em utils/buildFinancialSheets.ts
 */
export const financialSheetsData: Record<string, (string | number)[][]> = {
  Entradas: [
    ["Data", "Descrição", "Categoria", "Valor (R$)", "Status"],
    ["2026-05-16", "Venda balcão", "Receita", 2100, "Confirmado"],
    ["2026-05-17", "Pagamento OS #1042", "Serviço", 850, "Confirmado"],
    ["2026-05-18", "Peças cliente Maria", "Peça", 420, "Pendente"],
    ["", "TOTAL", "", "=SUM(D2:D4)", ""],
  ],
  Saidas: [
    ["Data", "Descrição", "Categoria", "Valor (R$)", "Status"],
    ["2026-05-16", "Fornecedor Motopeças", "Estoque", 1200, "Pago"],
    ["2026-05-17", "Aluguel galpão", "Fixo", 2800, "Pago"],
    ["2026-05-18", "Energia elétrica", "Utilidade", 680, "Pendente"],
    ["", "TOTAL", "", "=SUM(D2:D4)", ""],
  ],
  FluxoCaixa: [
    ["Data", "Saldo inicial", "Entradas", "Saídas", "Saldo final"],
    ["2026-05-14", 15000, 3200, 1800, "=B2+C2-D2"],
    ["2026-05-15", "=E2", 4100, 2200, "=B3+C3-D3"],
    ["2026-05-16", "=E3", 2100, 4000, "=B4+C4-D4"],
    ["2026-05-17", "=E4", 850, 2800, "=B5+C5-D5"],
    ["2026-05-18", "=E5", 420, 680, "=B6+C6-D6"],
    ["", "Totais", "=SUM(C2:C6)", "=SUM(D2:D6)", "=E6"],
  ],
  ContasPagar: [
    ["Vencimento", "Fornecedor", "Descrição", "Valor (R$)", "Parcela", "Status"],
    ["2026-05-20", "Motopeças", "NF 8821", 1200, "1/1", "Aberto"],
    ["2026-05-25", "Distribuidora XYZ", "Lote óleo", 890, "2/3", "Aberto"],
    ["2026-06-01", "Imobiliária", "Aluguel", 2800, "1/1", "Agendado"],
    ["", "TOTAL", "", "=SUM(D2:D4)", "", ""],
  ],
  ContasReceber: [
    ["Vencimento", "Cliente", "Descrição", "Valor (R$)", "Parcela", "Status"],
    ["2026-05-19", "João Silva", "OS #1042", 850, "1/1", "Aguardando loja"],
    ["2026-05-22", "Maria Santos", "Freio dianteiro", 420, "1/2", "Em espera"],
    ["2026-05-24", "Pedro Oliveira", "Pneu traseiro", 630, "1/1", "Pendente"],
    ["", "TOTAL", "", "=SUM(D2:D4)", "", ""],
  ],
};
