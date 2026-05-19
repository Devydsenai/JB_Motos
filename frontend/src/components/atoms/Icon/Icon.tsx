import type { HTMLAttributes } from "react";
import styled from "styled-components";

const StyledIcon = styled.i<{ $size?: number; $color?: string }>`
  font-size: ${({ $size }) => $size ?? 18}px;
  color: ${({ $color, theme }) => $color ?? theme.colors.text};
  line-height: 1;
`;

export interface IconProps extends HTMLAttributes<HTMLElement> {
  name: string;
  size?: number;
  color?: string;
}

/** Ícone Bootstrap Icons — use o nome sem o prefixo "bi-" (ex: "search", "box") */
export function Icon({ name, size, color, className, ...props }: IconProps) {
  return (
    <StyledIcon
      className={`bi bi-${name} ${className ?? ""}`.trim()}
      $size={size}
      $color={color}
      aria-hidden={!props["aria-label"]}
      {...props}
    />
  );
}
