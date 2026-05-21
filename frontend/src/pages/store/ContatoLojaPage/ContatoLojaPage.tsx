import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import { ThemeToggle } from "@components/molecules/ThemeToggle";
import { StoreAccountLink } from "../StoreAccountLink";
import logo from "@components/atoms/assets/Logo.JBmotos.svg";
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
  ColumnTitle,
  ContactForm,
  ContactGrid,
  ContactItem,
  ContactList,
  Content,
  MapArea,
  MapCard,
  Page,
  SocialLink,
  SocialList,
} from "./ContatoLojaPage.styles";

const STORAGE_CART = "jb-motos-store-cart";

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

export function ContatoLojaPage() {
  const [toast, setToast] = useState("");
  const cartCount = readCartCount();

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showToast("Mensagem enviada para teste.");
    event.currentTarget.reset();
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
            <Link to="/loja/contato" aria-current="page">Contate-nos</Link>
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
            <strong>Contate-nos</strong>
          </Breadcrumb>

          <MapArea>
            <iframe
              title="Mapa da JB Motos"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=JB%20Motos%20oficina&output=embed"
            />
            <MapCard>
              <h2>Nossa loja</h2>
              <p>
                JB Motos
                <br />
                Oficina, peças e acessórios para motocicletas
                <br />
                Atendimento presencial e online
              </p>
              <p>
                Segunda a sexta, das 10h às 21h.
                <br />
                Sábado, das 11h às 18h.
                <br />
                Domingo, das 11h às 17h.
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=JB%20Motos%20oficina"
                target="_blank"
                rel="noreferrer"
              >
                Obter direções
              </a>
            </MapCard>
          </MapArea>

          <ContactGrid>
            <section>
              <ColumnTitle>Contatos</ColumnTitle>
              <ContactList>
                <ContactItem>
                  <Icon name="house-door" size={32} color="currentColor" />
                  <div>
                    <h2>Endereço</h2>
                    <p>JB Motos, oficina de motocicletas</p>
                  </div>
                </ContactItem>
                <ContactItem>
                  <Icon name="telephone" size={32} color="currentColor" />
                  <div>
                    <h2>Telefone</h2>
                    <a href="tel:+550000000000">+55 (00) 00000-0000</a>
                  </div>
                </ContactItem>
                <ContactItem>
                  <Icon name="alarm" size={32} color="currentColor" />
                  <div>
                    <h2>Horas</h2>
                    <p>Aberto 7 dias por semana, das 10h às 18h.</p>
                  </div>
                </ContactItem>
                <ContactItem>
                  <Icon name="laptop" size={32} color="currentColor" />
                  <div>
                    <h2>E-mail</h2>
                    <a href="mailto:contato@jbmotos.com">contato@jbmotos.com</a>
                  </div>
                </ContactItem>
              </ContactList>
            </section>

            <section>
              <ColumnTitle>Entre em contato conosco</ColumnTitle>
              <ContactForm onSubmit={handleSubmit}>
                <input type="text" required placeholder="Nome *" />
                <input type="email" required placeholder="E-mail *" />
                <textarea required placeholder="Mensagem *" />
                <button type="submit">Enviar</button>
              </ContactForm>
            </section>

            <section>
              <ColumnTitle>Siga-nos</ColumnTitle>
              <SocialList>
                <SocialLink href="https://facebook.com" target="_blank" rel="noreferrer">
                  <Icon name="facebook" size={24} color="currentColor" />
                  Siga-nos no Facebook
                </SocialLink>
                <SocialLink href="https://x.com" target="_blank" rel="noreferrer">
                  <Icon name="twitter-x" size={24} color="currentColor" />
                  Siga-nos no Twitter
                </SocialLink>
                <SocialLink href="https://instagram.com" target="_blank" rel="noreferrer">
                  <Icon name="instagram" size={24} color="currentColor" />
                  Siga-nos no Instagram
                </SocialLink>
                <SocialLink href="https://youtube.com" target="_blank" rel="noreferrer">
                  <Icon name="youtube" size={24} color="currentColor" />
                  Inscreva-se no nosso canal do YouTube!
                </SocialLink>
              </SocialList>
            </section>
          </ContactGrid>
        </Content>
      </Page>

      <StoreFooter onNewsletter={() => showToast("Inscrição salva para teste.")} />
      {toast && <Toast>{toast}</Toast>}
    </>
  );
}
