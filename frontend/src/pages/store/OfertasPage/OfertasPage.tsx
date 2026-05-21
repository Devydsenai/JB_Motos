import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import { ThemeToggle } from "@components/molecules/ThemeToggle";
import logo from "@components/atoms/assets/Logo.JBmotos.svg";
import gallery1 from "@components/atoms/assets/mototab/gallery-1.jpg";
import glasses1 from "@components/atoms/assets/mototab/glasses-3pair-1.png";
import glasses2 from "@components/atoms/assets/mototab/glasses-3pair-2.png";
import goggles1 from "@components/atoms/assets/mototab/goggles-buzzard-1.png";
import gloves1 from "@components/atoms/assets/mototab/gloves-classic-1.png";
import helmet1 from "@components/atoms/assets/mototab/helmet-whisper-1.png";
import jacket1 from "@components/atoms/assets/mototab/jacket-atomic-1.png";
import type { CartItem, LojaProduct } from "../lojaTypes";
import { StoreCartAddedModal } from "../StoreCartAddedModal";
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
  Actions,
  Badge,
  Breadcrumb,
  Content,
  Layout,
  MotoBox,
  OfferCard,
  Page,
  Pager,
  Price,
  ProductImage,
  ProductInfo,
  ProductsGrid,
  Sidebar,
  SideProduct,
  Title,
} from "./OfertasPage.styles";

type RegisteredMoto = {
  modelo?: string;
  marca?: string;
  imagem?: string;
};

type OfferProduct = LojaProduct & {
  brand?: string;
  isSale?: boolean;
};

const STORAGE_CART = "jb-motos-store-cart";
const STORAGE_MOTOS = "jb-motos-client-motos";
const STORAGE_WISHLIST = "jb-motos-store-wishlist";

const collections = [
  "Modelos atendidos",
  "Ajuste de moto",
  "Ofertas",
  "Serviços",
  "Peças de reposição",
  "Ofertas especiais para pilotos",
  "Acessórios",
  "Vestuário",
];

const offers: OfferProduct[] = [
  {
    id: "oculos-birdz-almofadas",
    name: "Óculos de Motociclismo Birdz Eyewear Quail com Almofadas",
    price: "R$ 469,00",
    oldPrice: "R$ 550,00",
    description: "Proteção visual para pilotagem diária.",
    image: glasses1,
    hoverImage: glasses2,
    badge: "novo",
    isSale: true,
  },
  {
    id: "oculos-birdz-oriole",
    name: "Óculos de motociclismo acolchoados Birdz Eyewear Oriole",
    price: "R$ 137,00",
    description: "Conforto e visual esportivo para o piloto.",
    image: glasses2,
    hoverImage: glasses1,
    badge: "novo",
  },
  {
    id: "goggles-buzzard",
    name: "Óculos de proteção para motociclismo Birdz Eyewear Buzzard",
    price: "R$ 559,00",
    description: "Equipamento resistente para estrada e trilha.",
    image: goggles1,
    hoverImage: goggles1,
    badge: "novo",
  },
  {
    id: "corrente-honda",
    name: "Kit corrente compatível com motos Honda",
    price: "R$ 267,00",
    oldPrice: "R$ 330,00",
    description: "Peça de reposição filtrada pela marca cadastrada.",
    image: gloves1,
    hoverImage: gloves1,
    brand: "honda",
    isSale: true,
  },
  {
    id: "pedal-yamaha",
    name: "Pedal e acessórios compatíveis com motos Yamaha",
    price: "R$ 156,00",
    description: "Itens de reposição para modelos Yamaha atendidos.",
    image: jacket1,
    hoverImage: jacket1,
    brand: "yamaha",
  },
  {
    id: "capacete-glx",
    name: "Capacete GLX Whisper Full Face",
    price: "R$ 559,00",
    description: "Produto universal para qualquer motociclista.",
    image: helmet1,
    hoverImage: helmet1,
  },
];

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_CART);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readRegisteredMotos(): RegisteredMoto[] {
  try {
    const raw = localStorage.getItem(STORAGE_MOTOS);
    const parsed = raw ? (JSON.parse(raw) as RegisteredMoto[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readWishlist(): LojaProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_WISHLIST);
    const parsed = raw ? (JSON.parse(raw) as LojaProduct[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function OfertasPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(readCart);
  const [addedProduct, setAddedProduct] = useState<LojaProduct | null>(null);
  const [addedQuantity, setAddedQuantity] = useState(1);
  const [toast, setToast] = useState("");
  const moto = useMemo(() => readRegisteredMotos()[0], []);
  const motoBrand = moto?.marca?.trim().toLowerCase();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const filteredOffers = offers.filter(
    (item) => !item.brand || !motoBrand || item.brand === motoBrand,
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const addToCart = (product: OfferProduct) => {
    setCartItems((items) => {
      const exists = items.find((item) => item.id === product.id);
      if (exists) setAddedQuantity(exists.quantity + 1);
      else setAddedQuantity(1);
      const next = exists
        ? items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...items, { ...product, quantity: 1 }];

      localStorage.setItem(STORAGE_CART, JSON.stringify(next));
      return next;
    });
    setAddedProduct(product);
  };

  const addWishlist = (product: OfferProduct) => {
    const wishlist = readWishlist();

    if (wishlist.some((item) => item.id === product.id)) {
      showToast(`${product.name} já está nos favoritos.`);
      navigate("/loja/favoritos");
      return;
    }

    const favorite: LojaProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      description: product.description,
      image: product.image,
      hoverImage: product.hoverImage,
      badge: product.badge,
    };

    localStorage.setItem(STORAGE_WISHLIST, JSON.stringify([...wishlist, favorite]));
    showToast(`${product.name} foi para seus favoritos.`);
    navigate("/loja/favoritos");
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
            <Link to="/loja/minha-conta">
              <Icon name="person-fill" size={12} color="#fff" />
              Minha conta
            </Link>
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
          <Layout>
            <Sidebar>
              <Breadcrumb>
                <Link to="/loja">Início</Link>
                <span>›</span>
                <Link to="/loja/catalogo">Coleções</Link>
                <span>›</span>
                <strong>Oferta</strong>
              </Breadcrumb>

              <h2>Coleções</h2>
              <ul>
                {collections.map((item) => (
                  <li key={item}>
                    <Link to={item === "Ofertas" ? "/loja/ofertas" : "/loja/catalogo"}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>

              <MotoBox>
                <img
                  src={moto?.imagem || gallery1}
                  alt={moto?.modelo || "Moto do cliente"}
                />
                <div>
                  <span>{moto ? "Moto cadastrada" : "Nova coleção"}</span>
                  <h2>{moto?.marca || "Peças compatíveis"}</h2>
                </div>
                <p>
                  {moto
                    ? `Mostrando peças da marca ${moto.marca || "informada"} e itens universais para ${moto.modelo || "sua moto"}.`
                    : "Cadastre sua moto para ver peças apropriadas para a marca dela."}
                </p>
              </MotoBox>

              <h2>Produtos</h2>
              {filteredOffers.slice(3).map((product) => (
                <SideProduct key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div>
                    <h3>{product.name}</h3>
                    <strong>{product.price}</strong>
                    <Link to="/loja/catalogo">Visualizar</Link>
                  </div>
                </SideProduct>
              ))}
            </Sidebar>

            <div>
              <Title>Ofertas</Title>
              <ProductsGrid>
                {filteredOffers.slice(0, 9).map((product) => (
                  <OfferCard key={product.id}>
                    <ProductImage>
                      {product.badge && <Badge>{product.badge}</Badge>}
                      {product.isSale && <Badge $sale>oferta</Badge>}
                      <img src={product.image} alt={product.name} />
                    </ProductImage>
                    <ProductInfo>
                      <h2>{product.name}</h2>
                      <Price>
                        {product.oldPrice && <s>{product.oldPrice}</s>}
                        <span>{product.price}</span>
                      </Price>
                      <Actions>
                        <button type="button" onClick={() => addToCart(product)}>
                          <Icon name="cart3" size={14} color="currentColor" />{" "}
                          Adicionar ao carrinho
                        </button>
                        <div>
                          <button
                            type="button"
                            title="Adicionar aos favoritos"
                            onClick={() => addWishlist(product)}
                          >
                            <Icon name="heart" size={15} color="currentColor" />
                          </button>
                          <button type="button" title="Visualizar produto">
                            <Icon name="search" size={14} color="currentColor" />
                          </button>
                        </div>
                      </Actions>
                    </ProductInfo>
                  </OfferCard>
                ))}
              </ProductsGrid>

              <Pager>
                <span>1 - {filteredOffers.length} produto(s) de {offers.length}</span>
                <nav aria-label="Paginação de ofertas">
                  <span>‹ Anterior</span>
                  <strong>1</strong>
                  <span>2</span>
                  <span>3</span>
                  <span>Próximo ›</span>
                </nav>
              </Pager>
            </div>
          </Layout>
        </Content>
      </Page>

      <StoreFooter onNewsletter={() => showToast("Inscrição salva para teste.")} />
      <StoreCartAddedModal
        product={addedProduct}
        quantity={addedQuantity}
        onClose={() => setAddedProduct(null)}
      />
      {toast && <Toast>{toast}</Toast>}
    </>
  );
}
