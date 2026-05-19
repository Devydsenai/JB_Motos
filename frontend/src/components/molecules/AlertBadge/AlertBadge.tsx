import { Link } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "@components/atoms/Icon";

const BadgeLink = styled(Link)<{ $hasAlert?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    border-color: ${({ theme }) => theme.colors.warning};
    color: ${({ theme }) => theme.colors.warning};
  }
`;

const Count = styled.span`
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

export interface AlertBadgeProps {
  to: string;
  icon?: string;
  count?: number;
  title?: string;
}

/** Ícone de alerta (ex: requisições / estoque baixo) */
export function AlertBadge({
  to,
  icon = "exclamation-triangle",
  count = 0,
  title = "Alertas",
}: AlertBadgeProps) {
  return (
    <BadgeLink to={to} title={title} $hasAlert={count > 0}>
      <Icon name={icon} size={20} color={count > 0 ? "#d97706" : undefined} />
      {count > 0 && <Count>{count > 99 ? "99+" : count}</Count>}
    </BadgeLink>
  );
}
