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
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const InventoryHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const InventoryTitle = styled.div`
  h1 {
    font-size: 1.125rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.textMuted};

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

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.55rem 0.8rem;
  font-size: 0.8125rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: background 0.15s, border 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    border-color: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    background: #bdbdbd;
    border-color: #bdbdbd;
    cursor: not-allowed;
  }
`;

export const InventoryCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

export const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const ProductsTable = styled.table`
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

export const ProductDescription = styled.p`
  max-width: 250px;
  line-height: 1.35;
`;

export const StatusBadge = styled.button<{ $active: boolean }>`
  border: none;
  display: inline-flex;
  min-width: 88px;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.45rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: ${({ $active }) => ($active ? "#15803d" : "#dc2626")};
  background: ${({ $active }) => ($active ? "#dcfce7" : "#fee2e2")};
  cursor: pointer;
  transition: filter 0.15s, transform 0.15s;

  &:hover {
    filter: brightness(0.97);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(196, 30, 30, 0.18);
    outline-offset: 2px;
  }
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
  transition: color 0.15s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
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
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

export const ProductModal = styled.section`
  width: min(980px, 100%);
  max-height: calc(100vh - 3rem);
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
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
  display: inline-flex;
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

export const Dropzone = styled.label<{ $compact?: boolean }>`
  min-height: ${({ $compact }) => ($compact ? "108px" : "150px")};
  border: 2px dashed ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;

  input[type="file"] {
    display: none;
  }
`;

export const UploadHint = styled.p`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FileName = styled.p`
  font-size: 0.8125rem;
  font-weight: 800;
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
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.2s ease;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  .span-2 {
    grid-column: span 2;
  }

  @media (max-width: 780px) {
    grid-template-columns: 1fr;

    .span-2 {
      grid-column: auto;
    }
  }
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
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    font-size: 0.875rem;
    padding: 0.65rem 0.75rem;
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(196, 30, 30, 0.15);
  }
`;

export const SelectField = styled.select``;

export const TextAreaField = styled.textarea`
  min-height: 92px;
  resize: vertical;
`;

export const CheckboxField = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  align-self: end;
  min-height: 42px;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  input {
    accent-color: ${({ theme }) => theme.colors.primary};
    width: 18px;
    height: 18px;
  }
`;

export const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 1.25rem 0;
`;

export const FieldGroupTitle = styled.h3`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.95rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;

export const DangerText = styled.p`
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 700;
`;

export const FormActions = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  background: ${({ theme }) => theme.colors.surface};

  ${IconButton} {
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.55rem 0.85rem;
    gap: 0.4rem;
    font-weight: 700;
  }

  @media (max-width: 560px) {
    flex-direction: column-reverse;

    ${ActionButton},
    ${IconButton} {
      width: 100%;
    }
  }
`;
