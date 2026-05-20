import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Banner = styled.div`
  padding: 1rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.warningBg};
  border: 1px solid ${({ theme }) => theme.colors.warningBorder};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.warningText};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
`;

export const Section = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;

  th,
  td {
    padding: 0.65rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  th {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  tbody tr:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

export const Tag = styled.span<{ $tipo: string }>`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $tipo }) =>
    $tipo === "pagamento_cliente"
      ? "#dcfce7"
      : $tipo === "entrada"
        ? "#dbeafe"
        : "#fee2e2"};
  color: ${({ $tipo }) =>
    $tipo === "pagamento_cliente"
      ? "#166534"
      : $tipo === "entrada"
        ? "#1e40af"
        : "#991b1b"};
`;
