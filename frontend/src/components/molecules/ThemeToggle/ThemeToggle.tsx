import styled from "styled-components";
import { Icon } from "@components/atoms/Icon";
import { useThemeMode } from "@/contexts/ThemeContext";

const ToggleBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <ToggleBtn
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Tema claro" : "Tema escuro"}
    >
      <Icon name={isDark ? "sun-fill" : "moon-fill"} size={18} />
    </ToggleBtn>
  );
}
