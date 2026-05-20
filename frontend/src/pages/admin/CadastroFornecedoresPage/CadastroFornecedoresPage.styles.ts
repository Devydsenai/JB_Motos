import styled from "styled-components";
import type { StatusFornecedor } from "@/types/fornecedor";

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

export const ListHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const ListTitle = styled.div`
  h1 {
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

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const OutlineButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.55rem 0.8rem;
  font-size: 0.8125rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ActionButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.55rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background: #bdbdbd;
    border-color: #bdbdbd;
    cursor: not-allowed;
  }
`;

export const ListCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

export const TableWrap = styled.div`
  overflow-x: auto;
`;

export const SuppliersTable = styled.table`
  width: 100%;
  min-width: 960px;
  border-collapse: collapse;

  th,
  td {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    text-align: left;
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

export const CompanyCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`;

export const CompanyIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const CompanyName = styled.p`
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

export const CompanyId = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const statusStyles: Record<
  StatusFornecedor,
  { bg: string; color: string }
> = {
  ativo: { bg: "#dcfce7", color: "#15803d" },
  inativo: { bg: "#fee2e2", color: "#dc2626" },
  pendente: { bg: "#fef3c7", color: "#d97706" },
  critico: { bg: "#fce7f3", color: "#be185d" },
};

export const SupplierStatusBadge = styled.button<{ $status: StatusFornecedor }>`
  border: none;
  min-width: 88px;
  padding: 0.45rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  background: ${({ $status }) => statusStyles[$status].bg};
  color: ${({ $status }) => statusStyles[$status].color};
  transition: filter 0.15s;

  &:hover {
    filter: brightness(0.96);
  }
`;

export const RowActions = styled.div`
  display: flex;
  gap: 0.65rem;
`;

export const IconButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 0.15rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Pagination = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.85rem;
  display: flex;
  justify-content: center;
  align-items: center;
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

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(15, 17, 20, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow: auto;
`;

export const UploadModal = styled.section`
  width: min(440px, 100%);
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

export const FormModal = styled.section`
  width: min(980px, 100%);
  max-height: calc(100vh - 3rem);
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    font-size: 1rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const CloseButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const ModalBody = styled.div`
  padding: 1.25rem;
  overflow: auto;
`;

export const ModalFooter = styled.footer`
  padding: 0 1.25rem 1.25rem;

  ${ActionButton} {
    width: 100%;
  }
`;

export const Dropzone = styled.label`
  min-height: 150px;
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};

  input {
    display: none;
  }
`;

export const UploadHint = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FileName = styled.p`
  font-weight: 800;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const ProgressBar = styled.div`
  width: 78%;
  height: 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.2s;
`;

export const FormTwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const FieldGroupTitle = styled.h3`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.95rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.8125rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }

  input,
  textarea,
  select {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.65rem 0.75rem;
    font-size: 0.875rem;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(196, 30, 30, 0.12);
  }
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: 0.75rem;
`;

export const TextAreaField = styled.textarea`
  min-height: 92px;
  resize: vertical;
`;

export const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 1.25rem 0;
`;

export const ToggleRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  align-self: end;
`;

export const ToggleInput = styled.input`
  width: 44px;
  height: 24px;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

export const FileBrowseRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: stretch;

  input[type="text"] {
    flex: 1;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.55rem 0.75rem;
    font-size: 0.8125rem;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const BrowseButton = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.55rem 1rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
`;

export const FormActions = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  ${IconButton} {
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.55rem 0.85rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 700;
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;
