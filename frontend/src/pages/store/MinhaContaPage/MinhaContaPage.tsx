import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import { ThemeToggle } from "@components/molecules/ThemeToggle";
import logo from "@components/atoms/assets/Logo.JBmotos.svg";
import { funcionariosMock } from "@/data/mockFuncionarios";
import type { PerfilSistema } from "@/config/permissoes";
import { loginUnificado } from "@/services/auth";
import { saveAdminAuth } from "@/services/authStorage";
import { ContaCliente } from "../ContaCliente";
import { StoreAccountLink } from "../StoreAccountLink";
import { StoreFooter } from "../StoreFooter";
import { StoreMegaMenu } from "../StoreMegaMenu";
import { StoreOffersMenu } from "../StoreOffersMenu";
import type { LoginCredentials } from "../LoginCliente";
import {
  Header,
  HeaderCart,
  HeaderInner,
  LogoLink,
  Nav,
  Toast,
  TopActions,
  TopPanel,
  TopPanelInner,
  TopThemeWrap,
} from "../LojaHomePage/LojaHomePage.styles";

function findFuncionarioId(email: string, perfil: PerfilSistema): string | undefined {
  if (perfil === "dono") return undefined;
  const alvo = perfil === "mecanico" ? "mecanico" : "atendente";
  const f = funcionariosMock.find(
    (item) =>
      item.perfil === alvo && item.email.toLowerCase() === email.trim().toLowerCase(),
  );
  return f?.id;
}

export function MinhaContaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { mensagem?: string; from?: string } | null;
  const [toast, setToast] = useState(state?.mensagem ?? "");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const handleLogin = async ({ email, senha }: LoginCredentials) => {
    setLoginError("");
    setLoginLoading(true);
    try {
      const result = await loginUnificado(email, senha);

      if (result.tipo === "admin") {
        const funcionarioId = findFuncionarioId(email, result.perfil);
        const auth = result.auth;
        saveAdminAuth(auth);
        const sessaoPayload = {
          perfil: result.perfil,
          logado: true,
          userId: auth.user.id,
          funcionarioId,
        };
        localStorage.setItem("jb-motos-sessao", JSON.stringify(sessaoPayload));
        localStorage.setItem("jb-motos-perfil-sistema", result.perfil);

        showToast(
          result.perfil === "dono"
            ? "Bem-vindo, proprietário! Redirecionando ao painel…"
            : "Bem-vindo! Redirecionando ao painel…",
        );
        const destino = state?.from?.startsWith("/admin") ? state.from : result.redirectTo;
        window.setTimeout(() => navigate(destino, { replace: true }), 600);
        return;
      }

      showToast("Login realizado. Bem-vindo à sua conta!");
      navigate(result.redirectTo, { replace: true });
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : "Não foi possível entrar. Verifique e-mail e senha.",
      );
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      <TopPanel>
        <TopPanelInner>
          <span>Faça seu pedido online ou chame no WhatsApp da JB Motos</span>
          <TopActions>
            <Link to="/loja">
              <Icon name="house-fill" size={12} color="#fff" />
              Voltar para loja
            </Link>
            <StoreAccountLink />
            <TopThemeWrap>
              <ThemeToggle />
            </TopThemeWrap>
          </TopActions>
        </TopPanelInner>
      </TopPanel>

      <Header>
        <HeaderInner>
          <LogoLink as={Link} to="/loja" aria-label="JB Motos">
            <img src={logo} alt="JB Motos" />
          </LogoLink>
          <Nav aria-label="Menu da loja">
            <Link to="/loja">Início</Link>
            <StoreMegaMenu />
            <StoreOffersMenu />
            <Link to="/loja/servicos">Serviços</Link>
            <Link to="/loja/contato">Contate-nos</Link>
          </Nav>
          <HeaderCart as={Link} to="/loja/carrinho">
            <Icon name="cart3" size={14} color="currentColor" />
            Meu carrinho: 0 item(s)
          </HeaderCart>
        </HeaderInner>
      </Header>

      <ContaCliente
        onLogin={handleLogin}
        loginLoading={loginLoading}
        loginError={loginError}
        onCadastro={() => showToast("Cadastro do cliente salvo para teste.")}
        onCadastroMoto={() => showToast("Moto cadastrada para teste.")}
      />
      <StoreFooter onNewsletter={() => showToast("Inscrição salva para teste.")} />
      {toast && <Toast>{toast}</Toast>}
    </>
  );
}
