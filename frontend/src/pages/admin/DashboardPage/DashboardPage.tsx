import { useState } from "react";
import { Icon } from "@components/atoms/Icon";
import {
  getDashboardData,
  periodoLabels,
  type PeriodoFiltro,
} from "@/data/mockDashboard";
import { DashboardCategoryCards } from "./DashboardCategoryCards";
import { DashboardLineChart } from "./DashboardLineChart";
import {
  CategoriesPanel,
  ChartCard,
  ChartHeader,
  ChartSvgWrap,
  ChartTitle,
  ChartsRow,
  IconCircle,
  KpiCard,
  KpiContent,
  KpiGrid,
  KpiLabel,
  KpiTrend,
  KpiValue,
  Legend,
  LegendItem,
  MockNote,
  Page,
  PeriodTab,
  PeriodTabs,
} from "./DashboardPage.styles";

const PERIODOS: PeriodoFiltro[] = ["hoje", "semana", "dia", "mes"];

const iconColors: Record<string, string> = {
  "box-arrow-up": "#c41e1e",
  "box-arrow-in-down": "#16a34a",
  tools: "#f97316",
  "hourglass-split": "#8b5cf6",
};

export function DashboardPage() {
  const [periodo, setPeriodo] = useState<PeriodoFiltro>("mes");
  const { kpis, grafico, categorias } = getDashboardData(periodo);

  return (
    <Page>
      <KpiGrid>
        {kpis.map((kpi) => (
          <KpiCard key={kpi.id}>
            <KpiContent>
              <KpiLabel>{kpi.label}</KpiLabel>
              <KpiValue>{kpi.value}</KpiValue>
              <KpiTrend $up={kpi.trendUp}>{kpi.trend}</KpiTrend>
            </KpiContent>
            <IconCircle $bg={kpi.iconBg}>
              <Icon
                name={kpi.icon}
                size={22}
                color={iconColors[kpi.icon] ?? "#c41e1e"}
              />
            </IconCircle>
          </KpiCard>
        ))}
      </KpiGrid>

      <ChartsRow>
        <ChartCard>
          <ChartHeader>
            <ChartTitle>Controle da loja</ChartTitle>
            <PeriodTabs role="tablist" aria-label="Período do gráfico">
              {PERIODOS.map((p) => (
                <PeriodTab
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={periodo === p}
                  $active={periodo === p}
                  onClick={() => setPeriodo(p)}
                >
                  {periodoLabels[p]}
                </PeriodTab>
              ))}
            </PeriodTabs>
          </ChartHeader>

          <Legend>
            <LegendItem $color="#c41e1e">
              Movimentação atual da loja
            </LegendItem>
            <LegendItem $color="#1a1a1a">
              Referência do período
            </LegendItem>
          </Legend>

          <ChartSvgWrap>
            <DashboardLineChart dados={grafico} />
          </ChartSvgWrap>
          <MockNote>
            Dados de demonstração — integração com backend em breve.
          </MockNote>
        </ChartCard>

        <CategoriesPanel>
          <ChartHeader>
            <ChartTitle>Categorias da loja</ChartTitle>
          </ChartHeader>
          <DashboardCategoryCards categorias={categorias} />
        </CategoriesPanel>
      </ChartsRow>
    </Page>
  );
}
