import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import { ThemeToggle } from "@components/molecules/ThemeToggle";
import { StoreAccountLink } from "../StoreAccountLink";
import logo from "@components/atoms/assets/Logo.JBmotos.svg";
import gallery2 from "@components/atoms/assets/mototab/gallery-2.jpg";
import glasses from "@components/atoms/assets/mototab/glasses-3pair-1.png";
import gloves from "@components/atoms/assets/mototab/gloves-classic-1.png";
import helmet from "@components/atoms/assets/mototab/helmet-whisper-1.png";
import jacket from "@components/atoms/assets/mototab/jacket-atomic-1.png";
import rogue from "@components/atoms/assets/mototab/helmet-rogue-1.png";
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
  Breadcrumb,
  CatalogCard,
  CatalogGrid,
  CatalogImage,
  CatalogInfo,
  Content,
  Page,
  Title,
} from "./CatalogoPage.styles";

const STORAGE_CART = "jb-motos-store-cart";

const catalogItems = [
  {
    title: "Modelos atendidos",
    tag: "Oficina",
    image: helmet,
    description:
      "Categorias de motos que recebem manutenção, revisão e diagnóstico na JB Motos.",
    to: "/loja/servicos",
  },
  {
    title: "Ajuste de moto",
    tag: "Serviço",
    image: glasses,
    description:
      "Regulagens, conferências e pequenos ajustes para melhorar segurança e desempenho.",
    to: "/loja/servicos",
  },
  {
    title: "Ofertas",
    tag: "Promoções",
    image: gloves,
    description:
      "Peças, acessórios e equipamentos selecionados com condições especiais.",
    to: "/loja/ofertas",
  },
  {
    title: "Serviços",
    tag: "OS online",
    image: jacket,
    description:
      "Solicite atendimento, descreva o problema e abra uma ordem de serviço para a oficina.",
    to: "/loja/servicos",
  },
  {
    title: "Peças de reposição",
    tag: "Estoque",
    image: gallery2,
    description:
      "Itens para manutenção, substituição e preparo da moto conforme necessidade do serviço.",
    to: "/loja/catalogo",
  },
  {
    title: "Especiais para pilotos",
    tag: "Acessórios",
    image: rogue,
    description:
      "Equipamentos e acessórios para quem pilota no trabalho, lazer ou estrada.",
    to: "/loja/catalogo",
  },
];

function readCartCount() {
  try {
    const raw = localStorage.getItem(STORAGE_CART);
    const parsed = raw ? (JSON.parse(raw) as { quantity?: number }[]) : [];
    return Array.isArray(parsed)
      ? parsed.reduce((total, item) => total + Number(item.quantity ?? 0), 0)
      : 0;
  } catch {
    return 0;
  }
}

export function CatalogoPage() {
  const [toast, setToast] = useState("");
  const cartCount = readCartCount();

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
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
              Favoritos
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
            Meu carrinho: {cartCount} item(s)
          </HeaderCart>
        </HeaderInner>
      </Header>

      <Page>
        <Content>
          <Breadcrumb>
            <Link to="/loja">Início</Link>
            <span>›</span>
            <strong>Catálogo</strong>
          </Breadcrumb>

          <Title>Catálogo</Title>

          <CatalogGrid>
            {catalogItems.map((item) => (
              <CatalogCard key={item.title}>
                <CatalogImage>
                  <img src={item.image} alt={item.title} />
                </CatalogImage>
                <CatalogInfo>
                  <span>{item.tag}</span>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <Link to={item.to}>Ver detalhes</Link>
                </CatalogInfo>
              </CatalogCard>
            ))}
          </CatalogGrid>
        </Content>
      </Page>

      <StoreFooter onNewsletter={() => showToast("Inscrição salva para teste.")} />
      {toast && <Toast>{toast}</Toast>}
    </>
  );
}
