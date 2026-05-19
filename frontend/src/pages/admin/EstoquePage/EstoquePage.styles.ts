import styled from "styled-components";

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
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  h1,
  h2 {
    font-size: 1.125rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const ActionButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.55rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    border-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const Panel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

export const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;

  th,
  td {
    text-align: left;
    padding: 0.9rem 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    vertical-align: middle;
  }

  th {
    font-size: 0.7rem;
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
`;

export const ProductCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

export const ProductIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: #fb923c;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ProductName = styled.p`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

export const ProductCode = styled.p`
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.15rem;
`;

export const StatusBadge = styled.span<{
  $status: "estavel" | "baixo" | "critico";
}>`
  display: inline-flex;
  min-width: 92px;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.45rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;

  ${({ $status }) => {
    switch ($status) {
      case "estavel":
        return "color: #15803d; background: #dcfce7;";
      case "baixo":
        return "color: #b45309; background: #fef3c7;";
      case "critico":
        return "color: #b91c1c; background: #fee2e2;";
    }
  }}
`;

export const Pagination = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: ${({ $active, theme }) =>
    $active ? `${theme.colors.primary}22` : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textMuted};
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
`;

export const MovementForm = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 1.25rem;
`;

export const FormTitle = styled.h1`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.25rem;
`;

export const MovementTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const TypeButton = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : `${theme.colors.primary}22`};
  color: ${({ $active, theme }) => ($active ? "#fff" : theme.colors.primary)};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.8rem 1rem;
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 1.25rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};

  input,
  select,
  textarea {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.875rem;
    padding: 0.7rem 0.8rem;
  }

  textarea {
    min-height: 92px;
    resize: vertical;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(196, 30, 30, 0.15);
  }
`;

export const FullField = styled(Field)`
  grid-column: 1 / -1;
`;

export const FormActions = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 1.5rem;
  padding-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

export const GhostButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.55rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  cursor: pointer;
`;

export const MovementBadge = styled.span<{ $type: "entrada" | "saida" | "ajuste" }>`
  display: inline-flex;
  min-width: 92px;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.45rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;

  ${({ $type }) => {
    switch ($type) {
      case "entrada":
        return "color: #15803d; background: #dcfce7;";
      case "saida":
        return "color: #b91c1c; background: #fee2e2;";
      case "ajuste":
        return "color: #1d4ed8; background: #dbeafe;";
    }
  }}
`;

export const RowActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

export const IconButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.15rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
