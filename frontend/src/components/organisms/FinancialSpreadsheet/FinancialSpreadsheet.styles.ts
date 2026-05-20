import styled, { css } from "styled-components";
import type { ThemeMode } from "@/styles/themes";

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SyncBadge = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text};
  padding: 0.65rem 0.85rem;
  background: ${({ theme }) => theme.colors.background};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const SheetTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

export const SheetTab = styled.button<{ $active?: boolean }>`
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.surface};
  color: ${({ $active, theme }) =>
    $active ? "#fff" : theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.45rem 0.85rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ $active, theme }) => ($active ? "#fff" : theme.colors.primary)};
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const ImportFeedback = styled.p<{ $type: "success" | "error" }>`
  font-size: 0.8125rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  border-left: 4px solid
    ${({ $type, theme }) =>
      $type === "success" ? theme.colors.success : theme.colors.danger};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const gridScrollbar = css`
  & * {
    scrollbar-color: ${({ theme }) =>
        `${theme.colors.border} ${theme.colors.background}`}
      auto;
  }

  & *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  & *::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }

  & *::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }

  & *::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const GridHost = styled.div<{ $mode: ThemeMode }>`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  color-scheme: ${({ $mode }) => ($mode === "dark" ? "dark" : "light")};

  .handsontable {
    font-family: "Segoe UI", system-ui, sans-serif;
    font-size: 13px;
  }

  ${gridScrollbar}
`;

export const SheetHint = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const LicenseNote = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 0.65rem 0.85rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;
