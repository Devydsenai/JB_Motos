import styled from "styled-components";

export const InputWrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
`;

export const Label = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 0.55rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ theme, $hasError }) =>
      $hasError ? theme.colors.danger : theme.colors.border};
  font-size: 0.875rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(196, 30, 30, 0.15);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.danger};
`;

export const HintText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;
