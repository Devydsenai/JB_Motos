import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 49;
  background: rgba(15, 17, 20, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

export const Modal = styled.section`
  width: min(480px, 100%);
  max-height: min(90vh, 640px);
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const Header = styled.header`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;

  h2 {
    font-size: 1rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.35rem;
  }

  p {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.45;
  }
`;

export const Body = styled.div`
  padding: 1.25rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PerguntaRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

export const OpcaoBtn = styled.button<{ $ativo?: boolean }>`
  padding: 0.85rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid
    ${({ $ativo, theme }) =>
      $ativo ? theme.colors.primary : theme.colors.border};
  background: ${({ $ativo, theme }) =>
    $ativo ? "rgba(196, 30, 30, 0.08)" : theme.colors.surface};
  font-weight: 800;
  font-size: 0.875rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  input,
  textarea {
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.6rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  textarea {
    min-height: 4rem;
    resize: vertical;
  }
`;

export const ListaProdutos = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

export const ProdutoItem = styled.li<{ $selected?: boolean }>`
  button {
    width: 100%;
    text-align: left;
    padding: 0.65rem 0.85rem;
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ $selected, theme }) =>
      $selected ? "rgba(196, 30, 30, 0.08)" : theme.colors.surface};
    cursor: pointer;

    strong {
      display: block;
      font-size: 0.8125rem;
      color: ${({ theme }) => theme.colors.text};
    }

    span {
      font-size: 0.6875rem;
      color: ${({ theme }) => theme.colors.textMuted};
    }

    &:hover {
      background: rgba(196, 30, 30, 0.06);
    }
  }

  &:last-child button {
    border-bottom: none;
  }
`;

export const Erro = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 600;
  margin: 0;
`;

export const Hint = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  line-height: 1.4;
`;

export const Footer = styled.footer`
  padding: 0 1.25rem 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-shrink: 0;
`;

export const BtnOutline = styled.button`
  padding: 0.6rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  font-weight: 700;
  font-size: 0.8125rem;
  cursor: pointer;
`;

export const BtnPrimary = styled.button`
  padding: 0.6rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 800;
  font-size: 0.8125rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
