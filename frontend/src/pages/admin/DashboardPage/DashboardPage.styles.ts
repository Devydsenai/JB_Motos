import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const KpiCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const KpiContent = styled.div`
  min-width: 0;
`;

export const KpiLabel = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 0.35rem;
`;

export const KpiValue = styled.p`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
`;

export const KpiTrend = styled.p<{ $up?: boolean }>`
  font-size: 0.75rem;
  margin-top: 0.35rem;
  color: ${({ $up, theme }) =>
    $up === undefined
      ? theme.colors.textMuted
      : $up
        ? theme.colors.success
        : theme.colors.danger};
`;

export const IconCircle = styled.div<{ $bg: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(280px, 340px);
  gap: 1rem;
  align-items: stretch;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  min-height: 360px;
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

export const ChartTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const PeriodTabs = styled.div`
  display: inline-flex;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 3px;
  gap: 2px;
`;

export const PeriodTab = styled.button<{ $active?: boolean }>`
  border: none;
  padding: 0.4rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : "transparent"};
  color: ${({ $active }) => ($active ? "#fff" : "inherit")};

  &:hover:not(:disabled) {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primaryDark : "rgba(196, 30, 30, 0.1)"};
    color: ${({ $active, theme }) => ($active ? "#fff" : theme.colors.primary)};
  }
`;

export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 0.75rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const LegendItem = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  &::before {
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${({ $color }) => $color};
  }
`;

export const ChartSvgWrap = styled.div`
  flex: 1;
  min-height: 240px;
  color: ${({ theme }) => theme.colors.text};

  svg,
  .google-chart {
    width: 100%;
    height: 100%;
    min-height: 240px;
  }
`;

export const CategoriesPanel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  min-height: 360px;
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0.75rem;
  flex: 1;
  min-height: 280px;
`;

export const CategoryCard = styled.article<{ $accent: string }>`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 4px solid ${({ $accent }) => $accent};
  transition: box-shadow 0.15s, transform 0.15s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
  }
`;

export const CategoryCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
`;

export const CategoryCardLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const CategoryIconWrap = styled.div<{ $accent: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $accent }) => `${$accent}22`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const CategoryValue = styled.p`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
`;

export const CategoryPercent = styled.span<{ $accent: string }>`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ $accent }) => $accent};
`;

export const CategoryHint = styled.p`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.35;
  margin-top: auto;
`;

export const MockNote = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.5rem;
`;

export const OperationsGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(240px, 300px) 1fr;
  gap: 1rem;
  align-items: stretch;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const OperationsPanel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 1.25rem;
  overflow: hidden;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;

  h2 {
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const PanelAction = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ActivityItem = styled.article`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

export const ActivityIcon = styled.div<{ $color: string; $bg: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ActivityDetails = styled.div`
  min-width: 0;
`;

export const ActivityTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.15rem;
`;

export const ActivitySubtitle = styled.p`
  font-size: 0.75rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const StockTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 680px;

  th,
  td {
    text-align: left;
    padding: 0.85rem 0.75rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    vertical-align: middle;
  }

  th {
    font-size: 0.72rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  td {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  @media (max-width: 760px) {
    display: block;
    overflow-x: auto;
  }
`;

export const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ProductIcon = styled.div<{ $color: string; $bg: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ProductInfo = styled.div`
  min-width: 0;
`;

export const ProductName = styled.p`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const ProductCode = styled.p`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.1rem;
`;

export const StockText = styled.p`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.35rem;
`;

export const StockBar = styled.div`
  width: 180px;
  height: 7px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

export const StockBarFill = styled.div<{ $color: string }>`
  height: 100%;
  border-radius: inherit;
  background: ${({ $color }) => $color};
`;

export const StockStatusBadge = styled.span<{
  $status: "estavel" | "atencao" | "critico";
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 86px;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.45rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;

  ${({ $status }) => {
    switch ($status) {
      case "estavel":
        return `
          color: #15803d;
          background: #dcfce7;
        `;
      case "atencao":
        return `
          color: #b45309;
          background: #fef3c7;
        `;
      case "critico":
        return `
          color: #b91c1c;
          background: #fee2e2;
        `;
    }
  }}
`;
