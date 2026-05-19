import type { ButtonHTMLAttributes, ReactNode } from "react";
import { StyledButton } from "./Button.styles";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      type={type}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
}
