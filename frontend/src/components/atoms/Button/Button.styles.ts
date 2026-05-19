import styled, { css } from "styled-components";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryDark};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.secondary};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.secondary};
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary};
      color: #fff;
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid transparent;
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.border};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.danger};
  `,
};

const sizeStyles = {
  sm: css`padding: 0.35rem 0.75rem; font-size: 0.8125rem;`,
  md: css`padding: 0.5rem 1rem; font-size: 0.875rem;`,
  lg: css`padding: 0.75rem 1.25rem; font-size: 1rem;`,
};

export const StyledButton = styled.button<{
  $variant: Variant;
  $size: Size;
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border 0.15s;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};

  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
