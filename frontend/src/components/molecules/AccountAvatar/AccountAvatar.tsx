import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "@components/atoms/Icon";
import type { DropdownMenuItem } from "@components/molecules/DropdownMenu/DropdownMenu";

const Wrapper = styled.div`
  position: relative;
`;

const TriggerBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const AvatarLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.text};
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const Circle = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Label = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
`;

const Menu = styled.ul<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 200px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 100;
  display: ${({ $open }) => ($open ? "block" : "none")};
  overflow: hidden;
`;

const MenuItem = styled.li`
  a,
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.65rem 1rem;
    border: none;
    background: none;
    text-align: left;
    font-size: 0.875rem;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text};

    &:hover {
      background: ${({ theme }) => theme.colors.background};
    }
  }
`;

function AvatarIcon() {
  return (
    <Circle>
      <Icon name="person-fill" size={20} color="#ffffff" />
    </Circle>
  );
}

export interface AccountAvatarProps {
  label?: string;
  /** Link simples — ex.: loja → /admin */
  to?: string;
  title?: string;
  /** Menu suspenso (quando login existir) */
  menuItems?: DropdownMenuItem[];
}

export function AccountAvatar({
  label = "Minha conta",
  to,
  title,
  menuItems,
}: AccountAvatarProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuItems?.length) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuItems]);

  if (to && !menuItems?.length) {
    return (
      <AvatarLink to={to} title={title ?? label}>
        <AvatarIcon />
        <Label>{label}</Label>
      </AvatarLink>
    );
  }

  return (
    <Wrapper ref={ref}>
      <TriggerBtn
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <AvatarIcon />
        <Label>{label}</Label>
        {menuItems && menuItems.length > 0 && (
          <Icon name="chevron-down" size={14} />
        )}
      </TriggerBtn>
      {menuItems && menuItems.length > 0 && (
        <Menu $open={open} role="menu">
          {menuItems.map((item) => (
            <MenuItem key={item.label} role="none">
              {item.href ? (
                <Link to={item.href} onClick={() => setOpen(false)}>
                  {item.icon && <Icon name={item.icon} size={16} />}
                  {item.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                >
                  {item.icon && <Icon name={item.icon} size={16} />}
                  {item.label}
                </button>
              )}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
}
