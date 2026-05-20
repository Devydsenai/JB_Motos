import styled from "styled-components";
import type { StatusRh } from "@/types/funcionario";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const TabBar = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 0.35rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.8125rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? "#fff" : theme.colors.textMuted};

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primaryDark : `${theme.colors.primary}12`};
    color: ${({ $active, theme }) =>
      $active ? "#fff" : theme.colors.primary};
  }
`;

export const GridTwo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const GridStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: 1.25rem;
`;

export const CardHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    font-size: 1rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
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

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldFull = styled(Field)`
  grid-column: 1 / -1;
`;

export const SwitchRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  strong {
    display: block;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.25rem;
  }

  span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.4;
  }
`;

export const SwitchInput = styled.input`
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

export const EmailAddRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;

  input {
    flex: 1;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.55rem 0.75rem;
    font-size: 0.875rem;
  }
`;

export const AddEmailButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const EmailList = styled.ul`
  list-style: none;
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const EmailItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.8125rem;

  button {
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const InfoBox = styled.div`
  padding: 0.65rem 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const StatusOk = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 0.75rem;
  background: #dcfce7;
  color: #15803d;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  font-weight: 700;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 800;
  font-size: 0.875rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
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
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
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

export const SummaryIcon = styled.div<{ $bg: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const TableWrap = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;

  th {
    text-align: left;
    padding: 0.75rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.textMuted};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    white-space: nowrap;
  }

  td {
    padding: 0.85rem 0.75rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    vertical-align: middle;
  }

  tbody tr:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const statusRhStyles: Record<StatusRh, { bg: string; color: string }> = {
  ativo: { bg: "#dcfce7", color: "#15803d" },
  ferias: { bg: "#dbeafe", color: "#1d4ed8" },
  gestante: { bg: "#fce7f3", color: "#be185d" },
  acidente: { bg: "#fef3c7", color: "#d97706" },
  aviso_previo: { bg: "#fee2e2", color: "#dc2626" },
  afastado: { bg: "#f3f4f6", color: "#6b7280" },
  demitido: { bg: "#e5e7eb", color: "#374151" },
};

export const StatusBadge = styled.span<{ $status: StatusRh }>`
  display: inline-block;
  padding: 0.35rem 0.65rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.7rem;
  font-weight: 800;
  background: ${({ $status }) => statusRhStyles[$status].bg};
  color: ${({ $status }) => statusRhStyles[$status].color};
`;

export const PerfilBadge = styled.span`
  display: inline-block;
  padding: 0.35rem 0.65rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.7rem;
  font-weight: 800;
  background: #fee2e2;
  color: #c41e1e;
`;

export const RowActions = styled.div`
  display: flex;
  gap: 0.5rem;
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

export const FormModal = styled.section`
  width: min(920px, 100%);
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
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const ModalFooter = styled.footer`
  padding: 0 1.25rem 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const OutlineButton = styled.button`
  padding: 0.6rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  font-weight: 700;
  font-size: 0.8125rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
`;

export const SectionTitle = styled.h3`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

export const PermCard = styled.div`
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;

  strong {
    color: ${({ theme }) => theme.colors.primary};
    display: block;
    margin-bottom: 0.25rem;
  }
`;

export const ProfilePreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding-bottom: 0.5rem;
`;

export const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
`;

export const TempoTrabalho = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.25rem;
`;

export const TableAvatar = styled.div<{ $src?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $src, theme }) =>
    $src ? `url(${$src}) center/cover` : theme.colors.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

export const EmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

export const AvatarWrap = styled.div`
  position: relative;
  display: inline-block;
`;

export const AvatarPhoto = styled.div<{ $src?: string }>`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: ${({ $src, theme }) =>
    $src ? `url(${$src}) center/cover` : theme.colors.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 800;
  border: 3px solid ${({ theme }) => theme.colors.primary};
`;

export const AvatarCameraBtn = styled.label`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  input {
    display: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const CrachaHint = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

export const DemissaoModal = styled.section`
  width: min(480px, 100%);
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

export const DocActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;
