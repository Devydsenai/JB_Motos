export const theme = {
  colors: {
    primary: "#c41e1e",
    primaryDark: "#9a1818",
    secondary: "#1a1a1a",
    background: "#f4f5f7",
    surface: "#ffffff",
    border: "#e2e4e9",
    text: "#1a1a1a",
    textMuted: "#6b7280",
    success: "#16a34a",
    warning: "#d97706",
    danger: "#dc2626",
    sidebar: "#141414",
    sidebarText: "#e5e7eb",
    sidebarActive: "#c41e1e",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.06)",
    md: "0 4px 12px rgba(0,0,0,0.08)",
  },
  layout: {
    sidebarWidth: "260px",
    headerHeight: "64px",
  },
} as const;

export type Theme = typeof theme;
