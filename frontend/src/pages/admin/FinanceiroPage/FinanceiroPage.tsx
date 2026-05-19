import { useEffect, useMemo, useState } from "react";
import { Text } from "@components/atoms/Text";
import { StatCard } from "@components/molecules/StatCard";
import {
  apuracaoDiaria,
  lancamentos,
  type ApuracaoDiaria,
} from "@/data/mockFinanceiro";
import {
  analisarApuracao,
  analisarPagamentos,
  formatarData,
  formatarMoeda,
} from "@/utils/financeiro";
import {
  Banner,
  Grid,
  GoogleSheetFrame,
  Page,
  Section,
  SheetActionButton,
  SheetIntegrationHeader,
  SheetLink,
  SheetSyncStatus,
  Table,
  Tag,
} from "./FinanceiroPage.styles";

const tipoLabel: Record<string, string> = {
  pagamento_cliente: "Pagamento cliente",
  entrada: "Entrada",
  saida: "Saída",
};

const GOOGLE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1HbSJK6ZJqdaNbNf8AFkYeGOIIucqgwrrXLyOdD96oP8/edit?usp=sharing";
const GOOGLE_SHEETS_API_URL =
  "https://script.google.com/macros/s/AKfycbyCNC4GqUe6eS2hkQxLUMSEsBmeYxjC5uxPtfzrcuX6I6ozUTkiY48xog1vnTqGcUBX/exec";
const GOOGLE_SHEETS_API_TOKEN = "JB_MOTOS_TROQUE_ESSE_TOKEN";

type SheetApiResponse = {
  ok: boolean;
  erro?: string;
  valores?: unknown[][];
};

function toNumber(value: unknown) {
  if (typeof value === "number") return value;
  return (
    Number(
      String(value ?? "")
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(",", "."),
    ) || 0
  );
}

function toIsoDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value ?? "").trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);

  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (match) return `${match[3]}-${match[2]}-${match[1]}`;

  return new Date().toISOString().slice(0, 10);
}

function mapSheetRows(rows: unknown[][]): ApuracaoDiaria[] {
  return rows
    .filter((row) => row.some((cell) => String(cell ?? "").trim() !== ""))
    .map((row) => {
      const faturamento = toNumber(row[1]);
      const gastoReal = toNumber(row[2]);
      const lucroApurado = row[3] === "" || row[3] === undefined
        ? faturamento - gastoReal
        : toNumber(row[3]);

      return {
        data: toIsoDate(row[0]),
        faturamento,
        gastoReal,
        lucroApurado,
      };
    });
}

export function FinanceiroPage() {
  const [apuracaoFonte, setApuracaoFonte] =
    useState<ApuracaoDiaria[]>(apuracaoDiaria);
  const [syncStatus, setSyncStatus] = useState(
    "Usando dados locais enquanto conecta ao Google Planilhas.",
  );
  const apuracao = analisarApuracao(apuracaoFonte);
  const pagamentos = analisarPagamentos(lancamentos);
  const sheetApiUrl = useMemo(() => {
    const params = new URLSearchParams({
      token: GOOGLE_SHEETS_API_TOKEN,
      action: "ler",
      aba: "Apuracao diaria",
      range: "A4:D100",
    });

    return `${GOOGLE_SHEETS_API_URL}?${params.toString()}`;
  }, []);

  const sincronizarPlanilha = async () => {
    try {
      setSyncStatus("Sincronizando com Google Planilhas...");
      const response = await fetch(sheetApiUrl);
      const data = (await response.json()) as SheetApiResponse;

      if (!data.ok || !data.valores) {
        setSyncStatus(data.erro ?? "Nao foi possivel ler a planilha.");
        return;
      }

      const linhas = mapSheetRows(data.valores);
      if (linhas.length === 0) {
        setSyncStatus("Planilha conectada, mas sem linhas de apuracao.");
        return;
      }

      setApuracaoFonte(linhas);
      setSyncStatus("Dados sincronizados com Google Planilhas.");
    } catch {
      setSyncStatus("Falha ao conectar. Mantendo dados locais do financeiro.");
    }
  };

  useEffect(() => {
    sincronizarPlanilha();
    const intervalId = window.setInterval(sincronizarPlanilha, 30000);
    return () => window.clearInterval(intervalId);
  }, [sheetApiUrl]);

  return (
    <Page>
      <div>
        <Text as="h1" variant="h2" weight="bold">
          Financeiro
        </Text>
        <Text variant="body" color="muted" style={{ marginTop: "0.35rem" }}>
          Apuração diária, gastos reais e análise de pagamentos
        </Text>
      </div>

      <Banner>
        Dados de <strong>demonstração</strong> (mock). No JB Motos ainda não há
        registros reais de pagamento no banco — quando o backend subir a API,
        estes números virão do Supabase automaticamente.
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
        <SheetIntegrationHeader>
          <div>
            <Text variant="h3" weight="semibold">
              Google Planilhas financeiro
            </Text>
            <Text variant="body" color="muted" style={{ marginTop: "0.35rem" }}>
              Planilha financeira integrada ao administrativo para acompanhar os
              dados do Google Planilhas junto com o financeiro do sistema.
            </Text>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <SheetActionButton type="button" onClick={sincronizarPlanilha}>
              Atualizar dados
            </SheetActionButton>
            <SheetLink href={GOOGLE_SHEET_URL} target="_blank" rel="noreferrer">
              Abrir planilha
            </SheetLink>
          </div>
        </SheetIntegrationHeader>
        <SheetSyncStatus>{syncStatus}</SheetSyncStatus>

        <GoogleSheetFrame
          src={GOOGLE_SHEET_URL}
          title="Google Planilhas financeiro JB Motos"
          loading="lazy"
        />
      </Section>

      <Section>
        <Text variant="h3" weight="semibold" style={{ marginBottom: "1rem" }}>
          Apuração diária da loja
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
            {apuracaoFonte.map((dia) => (
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
