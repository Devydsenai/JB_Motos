import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "jb-motos-sidebar-collapsed";

type SidebarContextValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ collapsed, toggleCollapsed }),
    [collapsed, toggleCollapsed],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar deve ser usado dentro de SidebarProvider");
  }
  return ctx;
}
