import styled from "styled-components";
import type { EstoqueStatus } from "@/types/produto";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
    max-width: 52rem;
    line-height: 1.5;
  }
`;

export const InfoBanner = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.75rem 0.9rem;
  background: ${({ theme }) => theme.colors.background};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm};

  a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;
`;

export const PanelHead = styled.div`
  padding: 1rem 1.1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;

  h2 {
    font-size: 0.9375rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
  }

  span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 1px;
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  padding: 1rem;
  max-height: 520px;
  overflow-y: auto;
`;

export const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0 1rem 0.75rem;
`;

export const FilterChip = styled.button<{ $active?: boolean }>`
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

export const SectionBlock = styled.div`
  padding: 0 1rem 1rem;
`;

export const SectionTitle = styled.h3`
  font-size: 0.8125rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 0.75rem 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 0.75rem;
  }
`;

export const ProductCard = styled.button<{
  $selected?: boolean;
  $unavailable?: boolean;
}>`
  text-align: left;
  border: 2px solid
    ${({ $selected, $unavailable, theme }) =>
      $selected
        ? theme.colors.primary
        : $unavailable
          ? theme.colors.border
          : theme.colors.border};
  background: ${({ $selected, $unavailable, theme }) =>
    $selected
      ? theme.colors.background
      : $unavailable
        ? theme.colors.background
        : theme.colors.surface};
  opacity: ${({ $unavailable }) => ($unavailable ? 0.92 : 1)};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.85rem;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const IndisponivelHint = styled.span`
  display: block;
  margin-top: 0.4rem;
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.colors.danger};
  line-height: 1.35;
`;

export const SaidasPanel = styled.div`
  margin: 0 1rem 1rem;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

export const SaidasTitle = styled.p`
  font-size: 0.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

export const SaidasList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-height: 120px;
  overflow-y: auto;
`;

export const SaidaItem = styled.li`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;

  strong {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ProductTitle = styled.strong`
  display: block;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.25rem;
`;

export const ProductMeta = styled.span`
  display: block;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const estoqueColors: Record<EstoqueStatus, { bg: string; color: string }> = {
  estavel: { bg: "#dcfce7", color: "#16a34a" },
  baixo: { bg: "#fef3c7", color: "#d97706" },
  critico: { bg: "#fee2e2", color: "#dc2626" },
  zerado: { bg: "#f3f4f6", color: "#6b7280" },
};

export const EstoqueTag = styled.span<{ $status: EstoqueStatus }>`
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.625rem;
  font-weight: 800;
  background: ${({ $status }) => estoqueColors[$status].bg};
  color: ${({ $status }) => estoqueColors[$status].color};
`;

export const SidePanel = styled(Panel)`
  position: sticky;
  top: 0;
`;

export const SideBody = styled.div`
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};

  input,
  textarea,
  select {
    font-weight: 500;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.5rem 0.65rem;
    font-size: 0.8125rem;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }

  textarea {
    min-height: 72px;
    resize: vertical;
  }
`;

export const ClienteCard = styled.div`
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    display: block;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
  }

  span {
    display: block;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: 0.2rem;
  }
`;

export const ClientePicker = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

export const ClientePickerHead = styled.div`
  padding: 0.55rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

export const ResultList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-height: 200px;
  overflow-y: auto;
`;

export const ResultItem = styled.button<{ $active?: boolean }>`
  width: 100%;
  text-align: left;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? `${theme.colors.primary}14` : theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.6rem 0.75rem;
  cursor: pointer;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.35;

  strong {
    display: block;
    font-weight: 800;
  }

  span {
    font-size: 0.7rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.background};
  }
`;

export const SubmitBtn = styled.button`
  width: 100%;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.7rem 1rem;
  font-size: 0.875rem;
  font-weight: 800;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const SubmitHint = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.45;
  margin: 0;

  strong {
    color: ${({ theme }) => theme.colors.primary};
  }

  ul {
    margin: 0.35rem 0 0;
    padding-left: 1.1rem;
  }
`;

export const OutlineBtn = styled.button`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.55rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Toast = styled.p<{ $type?: "success" | "error" }>`
  font-size: 0.8125rem;
  padding: 0.55rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  border-left: 4px solid
    ${({ $type, theme }) =>
      $type === "error" ? theme.colors.danger : theme.colors.success};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

export const EmptyCatalog = styled.p`
  padding: 2rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8125rem;
`;

export const FormDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0.25rem 0;
`;

export const FormTitle = styled.p`
  font-size: 0.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;
