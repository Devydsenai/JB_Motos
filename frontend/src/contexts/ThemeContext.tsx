import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { getTheme, type ThemeMode } from "@/styles/themes";

const STORAGE_KEY = "jb-motos-theme";

type ThemeContextValue = {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    /* ignore */
  }
  return "light";
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setModeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);

  const value = useMemo(
    () => ({ mode, toggleTheme, setMode }),
    [mode, toggleTheme, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeMode deve ser usado dentro de AppThemeProvider");
  }
  return ctx;
}
