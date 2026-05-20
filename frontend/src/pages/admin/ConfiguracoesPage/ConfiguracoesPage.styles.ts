import styled from "styled-components";

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 720px;
`;

export const PageHeader = styled.div`
  h1 {
    font-size: 1.35rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.35rem;
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.5;
  }
`;

export const ProfileCard = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.5rem;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

export const Avatar = styled.div<{ $src?: string }>`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $src, theme }) =>
    $src ? `center/cover url(${$src})` : theme.colors.background};
  border: 3px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ProfileMain = styled.div`
  flex: 1;
  min-width: 0;

  h2 {
    font-size: 1.125rem;
    font-weight: 800;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.35rem;
  }
`;

export const PerfilBadge = styled.span<{ $perfil: string }>`
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: ${({ $perfil }) =>
    $perfil === "dono"
      ? "rgba(196, 30, 30, 0.12)"
      : $perfil === "mecanico"
        ? "rgba(37, 99, 235, 0.12)"
        : "rgba(22, 163, 74, 0.12)"};
  color: ${({ $perfil }) =>
    $perfil === "dono"
      ? "#c41e1e"
      : $perfil === "mecanico"
        ? "#2563eb"
        : "#16a34a"};
`;

export const ProfileMeta = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.5rem;
  line-height: 1.45;
`;

export const Section = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

export const SectionTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin: 0;
`;

export const FieldGrid = styled.dl`
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 0;
  margin: 0;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldRow = styled.div`
  display: contents;

  dt,
  dd {
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: 0.8125rem;
  }

  dt {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textMuted};
    background: ${({ theme }) => theme.colors.background};
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }

  &:last-of-type dt,
  &:last-of-type dd {
    border-bottom: none;
  }
`;

export const LogoutSection = styled.div`
  padding: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const LogoutBtn = styled.button`
  width: 100%;
  padding: 0.85rem 1.25rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 800;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const TesteCard = styled.section`
  background: ${({ theme }) => theme.colors.background};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1rem 1.25rem;

  h3 {
    font-size: 0.8125rem;
    font-weight: 800;
    margin-bottom: 0.35rem;
  }

  p {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: 0.75rem;
    line-height: 1.4;
  }
`;

export const TesteRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;

  select {
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
    background: ${({ theme }) => theme.colors.surface};
  }
`;

export const VincularForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;

  input {
    flex: 1;
    min-width: 120px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    background: ${({ theme }) => theme.colors.surface};
    font-weight: 700;
    font-size: 0.8125rem;
    cursor: pointer;
  }
`;

export const Erro = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: 0.5rem;
  font-weight: 600;
`;
