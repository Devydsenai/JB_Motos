import styled from "styled-components";
import type { EstoqueStatus } from "@/types/produto";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const SummaryGrid = styled.div`
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

export const SummaryCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const SummaryInfo = styled.div`
  min-width: 0;
`;

export const SummaryLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 0.5rem;
`;

export const SummaryValue = styled.p`
  font-size: 1.5rem;
  line-height: 1;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

export const SummaryIcon = styled.div<{ $color: string; $bg: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const InfoBanner = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.75rem 0.9rem;
  background: ${({ theme }) => theme.colors.background};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  line-height: 1.5;

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const PanelTitle = styled.div`
  h1 {
    font-size: 1.125rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.textMuted};
    max-width: 42rem;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

export const ActionButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.55rem 0.8rem;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, border 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    border-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const OutlineButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.55rem 0.8rem;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
`;

export const SearchField = styled.div`
  flex: 1;
  min-width: 200px;
  max-width: 320px;

  input {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};

    &::placeholder {
      color: ${({ theme }) => theme.colors.textMuted};
    }

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 1px;
    }
  }
`;

export const FilterSelect = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
`;

export const Panel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

export const TableWrap = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;

  th,
  td {
    padding: 0.85rem 1rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    vertical-align: middle;
  }

  th {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textMuted};
    background: ${({ theme }) => theme.colors.background};
  }

  tbody tr:hover td {
    background: ${({ theme }) => theme.colors.background};
  }
`;

export const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

export const ProductIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ProductName = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const ProductMeta = styled.span`
  display: block;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.15rem;
`;

const estoqueColors: Record<EstoqueStatus, { bg: string; color: string }> = {
  estavel: { bg: "#dcfce7", color: "#16a34a" },
  baixo: { bg: "#fef3c7", color: "#d97706" },
  critico: { bg: "#fee2e2", color: "#dc2626" },
  zerado: { bg: "#f3f4f6", color: "#6b7280" },
};

export const EstoqueBadge = styled.span<{ $status: EstoqueStatus }>`
  display: inline-flex;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  background: ${({ $status }) => estoqueColors[$status].bg};
  color: ${({ $status }) => estoqueColors[$status].color};
`;

export const LojaToggle = styled.button<{ $visivel: boolean }>`
  border: none;
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  background: ${({ $visivel, theme }) =>
    $visivel ? theme.colors.primary : theme.colors.border};
  color: ${({ $visivel }) => ($visivel ? "#fff" : "#6b7280")};

  &:hover {
    opacity: 0.92;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const EmptyRow = styled.td`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 2rem 1rem !important;
`;

export const Toast = styled.p<{ $type?: "success" | "info" }>`
  font-size: 0.8125rem;
  padding: 0.55rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  border-left: 4px solid
    ${({ $type, theme }) =>
      $type === "success" ? theme.colors.success : theme.colors.primary};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;
