import type { HTMLAttributes, ReactNode } from "react";
import { StyledText } from "./Text.styles";

type TextVariant = "h1" | "h2" | "h3" | "body" | "caption" | "label";
type TextWeight = "normal" | "medium" | "semibold" | "bold";
type TextColor = "default" | "muted" | "primary" | "danger" | "success";

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span" | "h1" | "h2" | "h3";
  variant?: TextVariant;
  weight?: TextWeight;
  color?: TextColor;
  children: ReactNode;
}

export function Text({
  as = "p",
  variant = "body",
  weight = "normal",
  color = "default",
  children,
  ...props
}: TextProps) {
  return (
    <StyledText
      as={as}
      $variant={variant}
      $weight={weight}
      $color={color}
      {...props}
    >
      {children}
    </StyledText>
  );
}
