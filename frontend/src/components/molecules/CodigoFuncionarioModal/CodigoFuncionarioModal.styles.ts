import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(15, 17, 20, 0.58);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

export const Modal = styled.section`
  width: min(400px, 100%);
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const Header = styled.header`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

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
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  label {
    font-size: 0.8125rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }

  input {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.75rem 1rem;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-align: center;
    font-variant-numeric: tabular-nums;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(196, 30, 30, 0.12);
    }
  }
`;

export const Erro = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 600;
`;

export const DicaTeste = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.4;
  margin: 0;
`;

export const Footer = styled.footer`
  padding: 0 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
`;

export const FooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

export const BtnPularAdmin = styled.button`
  width: 100%;
  padding: 0.55rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
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

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
