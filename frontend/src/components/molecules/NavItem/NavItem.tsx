import { NavLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { Icon } from "@components/atoms/Icon";

const linkStyles = css<{ $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.sidebarText};
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &.active {
    background: ${({ theme }) => theme.colors.sidebarActive};
    color: #fff;
  }

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      justify-content: center;
      padding: 0.65rem;
    `}
`;

const StyledNavLink = styled(NavLink)<{ $collapsed?: boolean }>`
  ${linkStyles}
`;

export interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  collapsed?: boolean;
  end?: boolean;
}

export function NavItem({
  to,
  icon,
  label,
  collapsed = false,
  end,
}: NavItemProps) {
  return (
    <li>
      <StyledNavLink to={to} end={end} $collapsed={collapsed} title={label}>
        <Icon name={icon} size={18} color="currentColor" />
        {!collapsed && <span>{label}</span>}
      </StyledNavLink>
    </li>
  );
}
