import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { GlobalStyle } from "./styles/GlobalStyle";
import { AppThemeProvider } from "./contexts/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppThemeProvider>
      <GlobalStyle />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppThemeProvider>
  </StrictMode>,
);
