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
    line-height: 1.5;
    max-width: 52rem;

    a {
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 600;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export const AlertBanner = styled.p`
  font-size: 0.8125rem;
  padding: 0.65rem 0.85rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.warningBg};
  border: 1px solid ${({ theme }) => theme.colors.warningBorder};
  color: ${({ theme }) => theme.colors.warningText};
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.1rem 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  strong {
    display: block;
    font-size: 1.75rem;
    margin-top: 0.35rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Panel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const PanelHead = styled.div`
  padding: 1rem 1.1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const PanelHeadText = styled.div`
  h2 {
    font-size: 0.9375rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
  }

  p {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: 0.25rem;
  }
`;

export const ExportActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

export const ExportBtn = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.5rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
    border-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const WaitingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

export const ReqCard = styled.article`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

export const ReqTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

export const ReqMeta = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.45;

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const StatusWaiting = styled.span`
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: #fef3c7;
  color: #d97706;
`;

export const ConcludeRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-top: 0.25rem;

  label {
    flex: 1;
    min-width: 100px;
    font-size: 0.6875rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textMuted};

    input {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      border: 1px solid ${({ theme }) => theme.colors.border};
      border-radius: ${({ theme }) => theme.radius.sm};
      padding: 0.4rem 0.5rem;
      font-size: 0.8125rem;
      background: ${({ theme }) => theme.colors.surface};
      color: ${({ theme }) => theme.colors.text};
    }
  }
`;

export const PrimaryBtn = styled.button`
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.5rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
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

export const EmptyState = styled.p`
  padding: 2rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8125rem;
`;

export const ValorDestaque = styled.span`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;
