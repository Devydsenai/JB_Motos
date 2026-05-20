import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const PageHeader = styled.div`
  h1 {
    font-size: 1.25rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.35rem;
  }

  p {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const SummaryCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1rem 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  strong {
    display: block;
    font-size: 1.5rem;
    margin-top: 0.35rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Panel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
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
    vertical-align: top;
  }

  th {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
    background: ${({ theme }) => theme.colors.background};
  }
`;

export const OrigemTag = styled.span<{ $balcao?: boolean }>`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.625rem;
  font-weight: 800;
  background: ${({ $balcao }) => ($balcao ? "#fee2e2" : "#dbeafe")};
  color: ${({ $balcao }) => ($balcao ? "#c41e1e" : "#2563eb")};
`;

export const ActionGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

export const ExtrasLista = styled.ul`
  list-style: none;
  margin: 0.5rem 0 0;
  padding: 0;
  font-size: 0.75rem;

  li {
    margin-top: 0.35rem;
    padding: 0.35rem 0.5rem;
    background: rgba(196, 30, 30, 0.06);
    border-radius: ${({ theme }) => theme.radius.sm};
    border-left: 3px solid ${({ theme }) => theme.colors.primary};
  }
`;

export const StatusBtn = styled.button<{ $variant?: "primary" | "muted" }>`
  text-decoration: none;
  display: inline-block;
  border: 1px solid
    ${({ $variant, theme }) =>
      $variant === "primary" ? theme.colors.primary : theme.colors.border};
  background: ${({ $variant, theme }) =>
    $variant === "primary" ? theme.colors.primary : "transparent"};
  color: ${({ $variant, theme }) =>
    $variant === "primary" ? "#fff" : theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.3rem 0.55rem;
  font-size: 0.6875rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const FilterBar = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const FilterBtn = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active }) => ($active ? "#fff" : "inherit")};
  border-radius: 999px;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
`;
