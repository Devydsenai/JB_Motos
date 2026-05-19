import type { ApuracaoDiaria, LancamentoFinanceiro } from "@/data/mockFinanceiro";

export function media(valores: number[]): number {
  if (valores.length === 0) return 0;
  return valores.reduce((a, b) => a + b, 0) / valores.length;
}

export function soma(valores: number[]): number {
  return valores.reduce((a, b) => a + b, 0);
}

export function analisarApuracao(apuracoes: ApuracaoDiaria[]) {
  const faturamentos = apuracoes.map((a) => a.faturamento);
  const gastos = apuracoes.map((a) => a.gastoReal);
  const lucros = apuracoes.map((a) => a.lucroApurado);

  return {
    dias: apuracoes.length,
    mediaFaturamentoDiario: media(faturamentos),
    mediaGastoRealDiario: media(gastos),
    mediaLucroDiario: media(lucros),
    totalFaturamento: soma(faturamentos),
    totalGastoReal: soma(gastos),
    totalLucro: soma(lucros),
  };
}

export function analisarPagamentos(lancamentos: LancamentoFinanceiro[]) {
  const pagamentosCliente = lancamentos.filter(
    (l) => l.tipo === "pagamento_cliente",
  );
  const saidas = lancamentos.filter((l) => l.tipo === "saida");
  const entradas = lancamentos.filter((l) => l.tipo === "entrada");

  const valoresPagamento = pagamentosCliente.map((l) => l.valor);
  const valoresSaida = saidas.map((l) => l.valor);
  const valoresEntrada = entradas.map((l) => l.valor);

  return {
    qtdPagamentosCliente: pagamentosCliente.length,
    mediaPagamentoCliente: media(valoresPagamento),
    totalPagamentosCliente: soma(valoresPagamento),
    mediaSaida: media(valoresSaida),
    totalSaidas: soma(valoresSaida),
    mediaEntrada: media(valoresEntrada),
    totalEntradas: soma(valoresEntrada),
    mediaGeralLancamento: media(lancamentos.map((l) => l.valor)),
  };
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarData(iso: string): string {
  return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR");
}
