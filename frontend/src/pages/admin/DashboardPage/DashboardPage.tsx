import { useState } from "react";
import { Icon } from "@components/atoms/Icon";
import {
  getDashboardData,
  periodoLabels,
  type PeriodoFiltro,
} from "@/data/mockDashboard";
import { DashboardBarChart } from "./DashboardBarChart";
import { DashboardCategoryCards } from "./DashboardCategoryCards";
import { DashboardOperationsPanel } from "./DashboardOperationsPanel";
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
  const { kpis, categorias, atividades, statusEstoque } =
    getDashboardData(periodo);

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
            <ChartTitle>Catálogo da loja</ChartTitle>
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
            {categorias.map((categoria) => (
              <LegendItem key={categoria.id} $color={categoria.cor}>
                {categoria.label}
              </LegendItem>
            ))}
          </Legend>

          <ChartSvgWrap>
            <DashboardBarChart dados={categorias} />
          </ChartSvgWrap>
          <MockNote>
            Dados de demonstração — integração com backend em breve.
          </MockNote>
        </ChartCard>

        <CategoriesPanel>
          <ChartHeader>
            <ChartTitle>Resumo por categoria</ChartTitle>
          </ChartHeader>
          <DashboardCategoryCards categorias={categorias} />
        </CategoriesPanel>
      </ChartsRow>

      <DashboardOperationsPanel
        atividades={atividades}
        statusEstoque={statusEstoque}
      />
    </Page>
  );
}
