export type ThemeMode = "light" | "dark";

const shared = {
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
  layout: {
    sidebarWidth: "260px",
    headerHeight: "64px",
  },
} as const;

const lightColors = {
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
  avatarIcon: "#ffffff",
  warningBg: "#fef3c7",
  warningBorder: "#fcd34d",
  warningText: "#92400e",
};

const darkColors = {
  primary: "#e02525",
  primaryDark: "#c41e1e",
  secondary: "#f5f5f5",
  background: "#0f1114",
  surface: "#1a1d23",
  border: "#2d333b",
  text: "#f0f2f5",
  textMuted: "#9ca3af",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  sidebar: "#0a0c0f",
  sidebarText: "#e5e7eb",
  sidebarActive: "#c41e1e",
  avatarIcon: "#ffffff",
  warningBg: "#422006",
  warningBorder: "#854d0e",
  warningText: "#fcd34d",
};

export function getTheme(mode: ThemeMode) {
  return {
    mode,
    colors: mode === "light" ? lightColors : darkColors,
    shadows:
      mode === "light"
        ? { sm: "0 1px 2px rgba(0,0,0,0.06)", md: "0 4px 12px rgba(0,0,0,0.08)" }
        : { sm: "0 1px 2px rgba(0,0,0,0.3)", md: "0 4px 12px rgba(0,0,0,0.45)" },
    ...shared,
  };
}

export type AppTheme = ReturnType<typeof getTheme>;
