import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const Banner = styled.div`
  padding: 1rem 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.warningBg};
  border: 1px solid ${({ theme }) => theme.colors.warningBorder};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.warningText};
`;

export const Card = styled.section`
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
