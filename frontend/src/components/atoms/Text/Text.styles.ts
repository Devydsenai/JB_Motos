import styled, { css } from "styled-components";

type Variant = "h1" | "h2" | "h3" | "body" | "caption" | "label";
type Weight = "normal" | "medium" | "semibold" | "bold";
type Color = "default" | "muted" | "primary" | "danger" | "success";

const variantStyles: Record<Variant, ReturnType<typeof css>> = {
  h1: css`font-size: 1.75rem; line-height: 1.2;`,
  h2: css`font-size: 1.375rem; line-height: 1.3;`,
  h3: css`font-size: 1.125rem; line-height: 1.4;`,
  body: css`font-size: 0.9375rem; line-height: 1.5;`,
  caption: css`font-size: 0.8125rem; line-height: 1.4;`,
  label: css`font-size: 0.75rem; line-height: 1.3; text-transform: uppercase; letter-spacing: 0.04em;`,
};

const weightStyles: Record<Weight, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

const colorMap = {
  default: (t: { colors: { text: string } }) => t.colors.text,
  muted: (t: { colors: { textMuted: string } }) => t.colors.textMuted,
  primary: (t: { colors: { primary: string } }) => t.colors.primary,
  danger: (t: { colors: { danger: string } }) => t.colors.danger,
  success: (t: { colors: { success: string } }) => t.colors.success,
};

export const StyledText = styled.p<{
  $variant: Variant;
  $weight: Weight;
  $color: Color;
}>`
  margin: 0;
  font-weight: ${({ $weight }) => weightStyles[$weight]};
  color: ${({ theme, $color }) => colorMap[$color](theme)};
  ${({ $variant }) => variantStyles[$variant]}
`;
