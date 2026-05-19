import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { Icon } from "@components/atoms/Icon";

const GroupWrap = styled.li`
  position: relative;
`;

const GroupButton = styled.button<{ $collapsed?: boolean; $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.65rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.sidebarActive : "transparent"};
  color: ${({ $active }) => ($active ? "#fff" : "inherit")};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.sidebarActive : "rgba(255, 255, 255, 0.08)"};
    color: #fff;
  }

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      justify-content: center;
      padding: 0.65rem;
    `}
`;

const Label = styled.span`
  flex: 1;
`;

const Chevron = styled.span<{ $open: boolean }>`
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  opacity: 0.85;
`;

const SubList = styled.ul`
  margin: 0.15rem 0 0.25rem 1rem;
  padding-left: 0.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
`;

const Flyout = styled.ul<{ $open: boolean }>`
  position: absolute;
  left: calc(100% + 6px);
  top: 0;
  min-width: 210px;
  padding: 0.35rem;
  background: ${({ theme }) => theme.colors.sidebar};
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  z-index: 300;
  display: ${({ $open }) => ($open ? "block" : "none")};
`;

const FlyoutTitle = styled.li`
  padding: 0.5rem 0.75rem 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.55);
`;

const SubLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.sidebarText};
  font-size: 0.8125rem;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  &.active {
    background: rgba(196, 30, 30, 0.35);
    color: #fff;
  }
`;

export type NavItemGroupLink = {
  to: string;
  icon: string;
  label: string;
};

export interface NavItemGroupProps {
  label: string;
  icon: string;
  matchPaths: string[];
  items: NavItemGroupLink[];
  collapsed?: boolean;
}

export function NavItemGroup({
  label,
  icon,
  matchPaths,
  items,
  collapsed = false,
}: NavItemGroupProps) {
  const { pathname } = useLocation();
  const ref = useRef<HTMLLIElement>(null);
  const isActive = matchPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  const [open, setOpen] = useState(isActive);
  const [flyoutOpen, setFlyoutOpen] = useState(false);

  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  useEffect(() => {
    if (!collapsed) setFlyoutOpen(false);
  }, [collapsed]);

  useEffect(() => {
    if (!flyoutOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setFlyoutOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [flyoutOpen]);

  const handleToggle = () => {
    if (collapsed) {
      setFlyoutOpen((prev) => !prev);
    } else {
      setOpen((prev) => !prev);
    }
  };

  const linkItems = items.map((item) => (
    <li key={item.to}>
      <SubLink
        to={item.to}
        title={item.label}
        onClick={() => setFlyoutOpen(false)}
      >
        <Icon name={item.icon} size={16} color="currentColor" />
        <span>{item.label}</span>
      </SubLink>
    </li>
  ));

  return (
    <GroupWrap ref={ref}>
      <GroupButton
        type="button"
        onClick={handleToggle}
        $collapsed={collapsed}
        $active={isActive}
        aria-expanded={collapsed ? flyoutOpen : open}
        title={label}
      >
        <Icon name={icon} size={18} color="currentColor" />
        {!collapsed && (
          <>
            <Label>{label}</Label>
            <Chevron $open={open} aria-hidden>
              <Icon name="chevron-down" size={14} color="currentColor" />
            </Chevron>
          </>
        )}
      </GroupButton>

      {collapsed && (
        <Flyout $open={flyoutOpen} role="menu">
          <FlyoutTitle>{label}</FlyoutTitle>
          {linkItems}
        </Flyout>
      )}

      {!collapsed && open && <SubList>{linkItems}</SubList>}
    </GroupWrap>
  );
}
