import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import { ThemeToggle } from "@components/molecules/ThemeToggle";
import { StoreAccountLink } from "../StoreAccountLink";
import logo from "@components/atoms/assets/Logo.JBmotos.svg";
import type { LojaProduct } from "../lojaTypes";
import { StoreFooter } from "../StoreFooter";
import { StoreMegaMenu } from "../StoreMegaMenu";
import { StoreOffersMenu } from "../StoreOffersMenu";
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
import {
  Alert,
  Breadcrumb,
  Content,
  FavoriteCard,
  FavoritesGrid,
  Layout,
  Page,
  Sidebar,
} from "./FavoritosPage.styles";

const STORAGE_WISHLIST = "jb-motos-store-wishlist";

function readWishlist(): LojaProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_WISHLIST);
    const parsed = raw ? (JSON.parse(raw) as LojaProduct[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const colecoes = [
  "Modelos atendidos",
  "Ajuste de moto",
  "Ofertas",
  "Serviços",
  "Peças",
  "Especiais para pilotos",
  "Acessórios",
  "Vestuário",
];

export function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<LojaProduct[]>(readWishlist);
  const [toast, setToast] = useState("");

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const removerFavorito = (id: string) => {
    const proximos = favoritos.filter((item) => item.id !== id);
    setFavoritos(proximos);
    localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(proximos));
    showToast("Produto removido dos favoritos.");
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
            <Link to="/loja/favoritos">
              <Icon name="heart-fill" size={12} color="#fff" />
              Favoritos ({favoritos.length})
            </Link>
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

      <Page>
        <Breadcrumb>
          <Link to="/loja">Início</Link>
          <span>›</span>
          <strong>Favoritos</strong>
        </Breadcrumb>

        <Layout>
          <Sidebar>
            <h2>Coleções</h2>
            <ul>
              {colecoes.map((item) => (
                <li key={item}>
                  <Link to="/loja/catalogo">{item}</Link>
                </li>
              ))}
            </ul>
          </Sidebar>

          <Content>
            <h1>Favoritos</h1>
            {favoritos.length === 0 ? (
              <Alert>
                <Link to="/loja/minha-conta">Faça login</Link> para adicionar
                produtos aos favoritos.
              </Alert>
            ) : (
              <>
                <Alert>
                  Produtos salvos para comprar depois ou quando estiver pronto
                  para fazer o serviço.
                </Alert>
                <FavoritesGrid>
                  {favoritos.map((item) => (
                    <FavoriteCard key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <h3>{item.name}</h3>
                        <strong>{item.price}</strong>
                        <button
                          type="button"
                          onClick={() => removerFavorito(item.id)}
                        >
                          Remover
                        </button>
                      </div>
                    </FavoriteCard>
                  ))}
                </FavoritesGrid>
              </>
            )}
          </Content>
        </Layout>
      </Page>

      <StoreFooter onNewsletter={() => showToast("Inscrição salva para teste.")} />
      {toast && <Toast>{toast}</Toast>}
    </>
  );
}
