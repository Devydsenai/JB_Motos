import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import { ThemeToggle } from "@components/molecules/ThemeToggle";
import { StoreAccountLink } from "../StoreAccountLink";
import logo from "@components/atoms/assets/Logo.JBmotos.svg";
import type { CartItem } from "../lojaTypes";
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
  CartFooter,
  CartRow,
  CartTable,
  NoteBox,
  Page,
  PurchaseHistory,
  ProductMeta,
  QuantityBox,
  RedBtn,
  SummaryLine,
  Title,
} from "./CarrinhoPage.styles";

const STORAGE_CART = "jb-motos-store-cart";
const STORAGE_PURCHASE_HISTORY = "jb-motos-store-purchase-history";

type PurchaseHistoryItem = {
  id: string;
  status: string;
  createdAt: string;
  total: number;
  items: CartItem[];
};

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_CART);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readPurchaseHistory(): PurchaseHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_PURCHASE_HISTORY);
    const parsed = raw ? (JSON.parse(raw) as PurchaseHistoryItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parsePrice(price: string) {
  const normalized = price.replace(/[^\d,]/g, "").replace(",", ".");
  return Number(normalized) || 0;
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function CarrinhoPage() {
  const [items, setItems] = useState<CartItem[]>(readCart);
  const [history] = useState<PurchaseHistoryItem[]>(readPurchaseHistory);
  const [toast, setToast] = useState("");
  const totalItens = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0,
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const removeItem = (id: string) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    localStorage.setItem(STORAGE_CART, JSON.stringify(next));
    showToast("Produto removido do carrinho.");
  };

  const updateQuantity = (id: string, quantity: number) => {
    const next = items.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
    );
    setItems(next);
    localStorage.setItem(STORAGE_CART, JSON.stringify(next));
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
            Meu carrinho: {totalItens} item(s)
          </HeaderCart>
        </HeaderInner>
      </Header>

      <Page>
        <Breadcrumb>
          <Link to="/loja">Início</Link>
          <span>›</span>
          <strong>Seu carrinho</strong>
        </Breadcrumb>

        <Title>Seu carrinho de compras</Title>

        {items.length === 0 ? (
          <Alert>
            Seu carrinho está vazio.{" "}
            <Link to="/loja/catalogo">
              Navegue pelo catálogo para encontrar peças e acessórios.
            </Link>
          </Alert>
        ) : (
          <>
            <CartTable>
              {items.map((item) => (
                <CartRow key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <ProductMeta>
                      <strong>Tipo de produto:</strong> Produto para motocicleta
                      <br />
                      <strong>Vendedor:</strong> JB Motos
                      <br />
                      <strong>Peso:</strong> 0,0 lb
                    </ProductMeta>
                    <RedBtn type="button" onClick={() => removeItem(item.id)}>
                      Remover
                    </RedBtn>
                  </div>
                  <strong>{item.price}</strong>
                  <QuantityBox>
                    <div>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </QuantityBox>
                  <strong>{formatPrice(parsePrice(item.price) * item.quantity)}</strong>
                </CartRow>
              ))}
            </CartTable>
            <SummaryLine>
              <span>Peso total</span>
              <strong>0,0 lb</strong>
            </SummaryLine>
            <SummaryLine>
              <span>Preço total</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </SummaryLine>
            <NoteBox>
              Adicione uma observação ao seu pedido.
              <textarea />
            </NoteBox>
            <Alert>
              A JB Motos processa pedidos em real (BRL). Frete, retirada e taxas
              serão calculados na finalização da compra.
            </Alert>
            <CartFooter>
              <Link to="/loja/ofertas">Continue comprando</Link>
              <strong>{totalItens} item(s)</strong>
              <Link to="/loja/checkout">Finalizar compra</Link>
            </CartFooter>
          </>
        )}

        {history.length > 0 && (
          <PurchaseHistory>
            <h2>Histórico de compras</h2>
            {history.slice(0, 5).map((purchase) => (
              <article key={purchase.id}>
                <div>
                  <strong>{purchase.id}</strong>
                  <span>
                    {new Date(purchase.createdAt).toLocaleString("pt-BR")} ·{" "}
                    {purchase.status === "aguardando_pagamento"
                      ? "Aguardando pagamento"
                      : purchase.status}
                  </span>
                </div>
                <p>
                  {purchase.items
                    .map((item) => `${item.quantity}x ${item.name}`)
                    .join(", ")}
                </p>
                <strong>{formatPrice(purchase.total)}</strong>
              </article>
            ))}
          </PurchaseHistory>
        )}
      </Page>

      <StoreFooter onNewsletter={() => showToast("Inscrição salva para teste.")} />
      {toast && <Toast>{toast}</Toast>}
    </>
  );
}
