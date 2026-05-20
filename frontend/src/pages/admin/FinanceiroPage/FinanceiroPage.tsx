import { Text } from "@components/atoms/Text";
import { StatCard } from "@components/molecules/StatCard";
import { FinancialSpreadsheet } from "@components/organisms/FinancialSpreadsheet";
import { apuracaoDiaria, lancamentos } from "@/data/mockFinanceiro";
import {
  analisarApuracao,
  analisarPagamentos,
  formatarData,
  formatarMoeda,
} from "@/utils/financeiro";
import {
  Banner,
  Grid,
  Page,
  Section,
  Table,
  Tag,
} from "./FinanceiroPage.styles";

const tipoLabel: Record<string, string> = {
  pagamento_cliente: "Pagamento cliente",
  entrada: "Entrada",
  saida: "Saída",
};

export function FinanceiroPage() {
  const apuracao = analisarApuracao(apuracaoDiaria);
  const pagamentos = analisarPagamentos(lancamentos);

  return (
    <Page>
      <div>
        <Text as="h1" variant="h2" weight="bold">
          Financeiro
        </Text>
        <Text variant="body" color="muted" style={{ marginTop: "0.35rem" }}>
          Planilha integrada ao sistema + apuração e lançamentos
        </Text>
      </div>

      <Banner>
        A <strong>planilha JB Motos</strong> usa os mesmos dados de Clientes,
        Estoque, Serviços, Requisições e Apuração diária. Quando o backend
        subir, todas as telas e a planilha passam a ler o mesmo Supabase.
      </Banner>

      <Text variant="h3" weight="semibold">
        Resumo do período ({apuracao.dias} dias)
      </Text>
      <Grid>
        <StatCard
          label="Média faturamento / dia"
          value={formatarMoeda(apuracao.mediaFaturamentoDiario)}
          icon="graph-up-arrow"
          accent="success"
        />
        <StatCard
          label="Média gasto real / dia"
          value={formatarMoeda(apuracao.mediaGastoRealDiario)}
          icon="cash-stack"
          accent="warning"
        />
        <StatCard
          label="Média lucro apurado / dia"
          value={formatarMoeda(apuracao.mediaLucroDiario)}
          icon="piggy-bank"
          accent="success"
        />
        <StatCard
          label="Média por pagamento (cliente)"
          value={formatarMoeda(pagamentos.mediaPagamentoCliente)}
          hint={`${pagamentos.qtdPagamentosCliente} pagamento(s) no período`}
          icon="credit-card"
        />
        <StatCard
          label="Média geral por lançamento"
          value={formatarMoeda(pagamentos.mediaGeralLancamento)}
          hint="Todos os tipos (entrada, saída, cliente)"
          icon="calculator"
        />
        <StatCard
          label="Total faturamento (período)"
          value={formatarMoeda(apuracao.totalFaturamento)}
          icon="currency-dollar"
        />
      </Grid>

      <Section>
        <Text variant="h3" weight="semibold" style={{ marginBottom: "1rem" }}>
          Planilha financeira JB Motos
        </Text>
        <FinancialSpreadsheet />
      </Section>

      <Section>
        <Text variant="h3" weight="semibold" style={{ marginBottom: "1rem" }}>
          Apuração diária da loja
        </Text>
        <Text variant="caption" color="muted" style={{ marginBottom: "0.75rem" }}>
          Mesmos valores da aba <strong>Fluxo de caixa</strong> na planilha acima.
        </Text>
        <Table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Faturamento</th>
              <th>Gasto real</th>
              <th>Lucro apurado</th>
            </tr>
          </thead>
          <tbody>
            {apuracaoDiaria.map((dia) => (
              <tr key={dia.data}>
                <td>{formatarData(dia.data)}</td>
                <td>{formatarMoeda(dia.faturamento)}</td>
                <td>{formatarMoeda(dia.gastoReal)}</td>
                <td>{formatarMoeda(dia.lucroApurado)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section>
        <Text variant="h3" weight="semibold" style={{ marginBottom: "1rem" }}>
          Pagamentos e lançamentos
        </Text>
        <Text variant="caption" color="muted" style={{ marginBottom: "0.75rem" }}>
          Alimenta as abas <strong>Entradas</strong> e <strong>Saídas</strong> da
          planilha.
        </Text>
        <Table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {lancamentos.map((item) => (
              <tr key={item.id}>
                <td>{formatarData(item.data)}</td>
                <td>{item.descricao}</td>
                <td>
                  <Tag $tipo={item.tipo}>{tipoLabel[item.tipo]}</Tag>
                </td>
                <td>{formatarMoeda(item.valor)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Text variant="caption" color="muted" style={{ marginTop: "0.75rem" }}>
          Total pagamentos de clientes:{" "}
          {formatarMoeda(pagamentos.totalPagamentosCliente)} · Média saídas:{" "}
          {formatarMoeda(pagamentos.mediaSaida)}
        </Text>
      </Section>
    </Page>
  );
}
