import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "@components/atoms/Icon";

const Wrapper = styled.div`
  position: relative;
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.6rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Menu = styled.ul<{ $open: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 180px;
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

export interface DropdownMenuItem {
  label: string;
  icon?: string;
  onClick?: () => void;
  href?: string;
}

export interface DropdownMenuProps {
  label: string;
  icon?: string;
  items: DropdownMenuItem[];
  children?: ReactNode;
}

export function DropdownMenu({
  label,
  icon = "person-circle",
  items,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Wrapper ref={ref}>
      <Trigger type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <Icon name={icon} size={20} />
        <span>{label}</span>
        <Icon name="chevron-down" size={14} />
      </Trigger>
      <Menu $open={open} role="menu">
        {items.map((item) => (
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
    </Wrapper>
  );
}
