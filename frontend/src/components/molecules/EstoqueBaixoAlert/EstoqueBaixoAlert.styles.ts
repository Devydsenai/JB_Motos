import { Link } from "react-router-dom";
import styled from "styled-components";
import type { EstoqueStatus } from "@/types/produto";

export const Wrapper = styled.div`
  position: relative;
`;

export const Trigger = styled.button<{ $hasAlert?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ $hasAlert, theme }) =>
      $hasAlert ? theme.colors.warning : theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.warning};
    color: ${({ theme }) => theme.colors.warning};
  }
`;

export const Count = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.danger};
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Panel = styled.div<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: min(380px, calc(100vw - 2rem));
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 120;
  display: ${({ $open }) => ($open ? "flex" : "none")};
  flex-direction: column;
  overflow: hidden;
`;

export const PanelHeader = styled.div`
  padding: 0.85rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};

  h3 {
    font-size: 0.875rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.2rem;
  }

  p {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const PanelList = styled.ul`
  list-style: none;
  max-height: 320px;
  overflow-y: auto;
`;

export const PanelItem = styled.li`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const ItemLink = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: inherit;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

export const ItemTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
`;

export const ItemName = styled.strong`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.3;
`;

export const ItemMeta = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const StatusChip = styled.span<{ $status: EstoqueStatus }>`
  flex-shrink: 0;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.25rem 0.45rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  ${({ $status }) => {
    switch ($status) {
      case "zerado":
        return "color: #991b1b; background: #fee2e2;";
      case "critico":
        return "color: #b91c1c; background: #fecaca;";
      case "baixo":
        return "color: #b45309; background: #fef3c7;";
      default:
        return "color: #15803d; background: #dcfce7;";
    }
  }}
`;

export const EmptyState = styled.p`
  padding: 1.5rem 1rem;
  text-align: center;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const PanelFooter = styled.div`
  padding: 0.75rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FooterLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.55rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 800;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const FooterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;
