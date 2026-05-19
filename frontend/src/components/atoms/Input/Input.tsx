import type { InputHTMLAttributes } from "react";
import {
  ErrorText,
  HintText,
  InputWrapper,
  Label,
  StyledInput,
} from "./Input.styles";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export function Input({
  label,
  error,
  hint,
  fullWidth = false,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <InputWrapper $fullWidth={fullWidth}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <StyledInput id={inputId} $hasError={!!error} {...props} />
      {error && <ErrorText>{error}</ErrorText>}
      {!error && hint && <HintText>{hint}</HintText>}
    </InputWrapper>
  );
}
