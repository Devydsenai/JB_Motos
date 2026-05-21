import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import { ThemeToggle } from "@components/molecules/ThemeToggle";
import logo from "@components/atoms/assets/Logo.JBmotos.svg";
import gallery1 from "@components/atoms/assets/mototab/gallery-1.jpg";
import gallery2 from "@components/atoms/assets/mototab/gallery-2.jpg";
import gallery3 from "@components/atoms/assets/mototab/gallery-3.jpg";
import gloves1 from "@components/atoms/assets/mototab/gloves-classic-1.png";
import gloves2 from "@components/atoms/assets/mototab/gloves-classic-2.png";
import jacket1 from "@components/atoms/assets/mototab/jacket-atomic-1.png";
import jacket2 from "@components/atoms/assets/mototab/jacket-atomic-2.png";
import helmet1 from "@components/atoms/assets/mototab/helmet-whisper-1.png";
import helmet2 from "@components/atoms/assets/mototab/helmet-whisper-2.png";
import rogue1 from "@components/atoms/assets/mototab/helmet-rogue-1.png";
import rogue2 from "@components/atoms/assets/mototab/helmet-rogue-2.png";
import goggles1 from "@components/atoms/assets/mototab/goggles-buzzard-1.png";
import goggles2 from "@components/atoms/assets/mototab/goggles-buzzard-2.png";
import glasses1 from "@components/atoms/assets/mototab/glasses-3pair-1.png";
import glasses2 from "@components/atoms/assets/mototab/glasses-3pair-2.png";
import type { CartItem, LojaProduct } from "../lojaTypes";
import { StoreCartAddedModal } from "../StoreCartAddedModal";
import { StoreFooter } from "../StoreFooter";
import { StoreMegaMenu } from "../StoreMegaMenu";
import { StoreOffersMenu } from "../StoreOffersMenu";
import {
  Badge,
  BannerCard,
  BannerGrid,
  BlogCard,
  BlogGrid,
  Button,
  CardActions,
  Container,
  GalleryCard,
  GalleryGrid,
  Header,
  HeaderCart,
  HeaderInner,
  Hero,
  HeroContent,
  HeroSlide,
  LogoLink,
  Nav,
  OverlaySale,
  Page,
  Price,
  ProductCard,
  ProductGrid,
  ProductImage,
  ProductInfo,
  Section,
  SectionHeading,
  SearchCloseBtn,
  SearchSubmitBtn,
  Toast,
  TopSearchForm,
  TopThemeWrap,
  TopActions,
  TopPanel,
  TopPanelInner,
} from "./LojaHomePage.styles";

const products: LojaProduct[] = [
  {
    id: "luvas-classic",
    name: "Luvas Decade Motorsport Street Classic",
    price: "R$ 320,00",
    description:
      "Para quem pilota todo dia ou vive a estrada no fim de semana, com proteção e pegada firme.",
    image: gloves1,
    hoverImage: gloves2,
    badge: "novo",
  },
  {
    id: "jaqueta-atomic",
    name: "Jaqueta de motociclismo Joe Rocket Atomic 4.0",
    price: "R$ 137,00",
    description:
      "Jaqueta urbana com visual esportivo, pronta para encontros, corridas e uso diário.",
    image: jacket1,
    hoverImage: jacket2,
    badge: "novo",
  },
  {
    id: "capacete-whisper",
    name: "Capacete integral GLX Whisper branco",
    price: "R$ 559,00",
    description:
      "Segurança, conforto e estilo para o motociclista que exige confiança na pilotagem.",
    image: helmet1,
    hoverImage: helmet2,
    badge: "novo",
  },
  {
    id: "capacete-rogue",
    name: "Capacete Bell Solid Rogue Cruiser",
    oldPrice: "R$ 180,00",
    price: "R$ 140,00",
    description:
      "Modelo cruiser com acabamento marcante para passeio, estrada e rotina na cidade.",
    image: rogue1,
    hoverImage: rogue2,
    badge: "oferta",
  },
  {
    id: "oculos-buzzard",
    name: "Óculos Birdz Eyewear Buzzard",
    price: "R$ 559,00",
    description:
      "Proteção visual para pilotagem com conforto e desenho agressivo no estilo Mototab.",
    image: goggles1,
    hoverImage: goggles2,
    badge: "novo",
  },
  {
    id: "oculos-3-pares",
    name: "3 pares de óculos de motociclismo",
    price: "R$ 156,00",
    description:
      "Lentes fumê, transparentes e amarelas para diferentes horários e condições de estrada.",
    image: glasses1,
    hoverImage: glasses2,
    badge: "novo",
  },
];

const heroSlides = [
  {
    title: "Oficina JB Motos",
    subtitle: "Serviços e peças para sua moto",
    image: gallery1,
    delay: "0s",
  },
  {
    title: "Manutenção completa",
    subtitle: "Atendimento para modelos urbanos e esportivos",
    image: gallery2,
    delay: "5s",
  },
  {
    title: "Peças e acessórios",
    subtitle: "Produtos para pilotar com segurança",
    image: gallery3,
    delay: "10s",
  },
];

const STORAGE_WISHLIST = "jb-motos-store-wishlist";
const STORAGE_CART = "jb-motos-store-cart";

function readWishlist(): LojaProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_WISHLIST);
    const parsed = raw ? (JSON.parse(raw) as LojaProduct[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_CART);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function LojaHomePage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(readCart);
  const [wishlistItems, setWishlistItems] = useState<LojaProduct[]>(readWishlist);
  const [addedProduct, setAddedProduct] = useState<LojaProduct | null>(null);
  const [addedQuantity, setAddedQuantity] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState("");

  const heroAtual = useMemo(() => heroSlides[0], []);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const addToCart = (product: LojaProduct) => {
    setCartItems((items) => {
      const exists = items.find((item) => item.id === product.id);
      if (exists) {
        setAddedQuantity(exists.quantity + 1);
        const next = items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
        localStorage.setItem(STORAGE_CART, JSON.stringify(next));
        return next;
      }
      setAddedQuantity(1);
      const next = [...items, { ...product, quantity: 1 }];
      localStorage.setItem(STORAGE_CART, JSON.stringify(next));
      return next;
    });
    setAddedProduct(product);
  };

  const addWishlist = (product: LojaProduct) => {
    if (wishlistItems.some((item) => item.id === product.id)) {
      showToast(`${product.name} já está nos favoritos.`);
      navigate("/loja/favoritos");
      return;
    }

    const next = [...wishlistItems, product];
    setWishlistItems(next);
    localStorage.setItem(STORAGE_WISHLIST, JSON.stringify(next));
    showToast(`${product.name} foi para seus favoritos.`);
    navigate("/loja/favoritos");
  };

  return (
    <Page>
      <TopPanel>
        <TopPanelInner>
          <span>Faça seu pedido online ou chame no WhatsApp da JB Motos</span>
          <TopActions>
            <TopSearchForm
              data-open={searchOpen}
              onSubmit={(event) => {
                event.preventDefault();
                const termo = searchTerm.trim();
                if (termo) showToast(`Buscando por "${termo}" na loja.`);
              }}
            >
              <SearchSubmitBtn
                type="button"
                aria-label={searchOpen ? "Fechar busca" : "Abrir busca"}
                onClick={() => {
                  setSearchOpen((open) => !open);
                  if (searchOpen) setSearchTerm("");
                }}
              >
                <Icon name="search" size={12} color="currentColor" />
                {!searchOpen && "Busca"}
              </SearchSubmitBtn>
              <input
                type="search"
                placeholder="Busca"
                aria-label="Procurar"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchOpen && (
                <SearchCloseBtn
                  type="button"
                  aria-label="Fechar busca"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchTerm("");
                  }}
                >
                  ×
                </SearchCloseBtn>
              )}
            </TopSearchForm>
            <Link to="/loja/minha-conta">
              <Icon name="person-fill" size={12} color="#fff" />
              Minha conta
            </Link>
            <Link to="/loja/favoritos">
              <Icon name="heart-fill" size={12} color="#fff" />
              Favoritos ({wishlistCount})
            </Link>
            <span>BRL</span>
            <TopThemeWrap>
              <ThemeToggle />
            </TopThemeWrap>
          </TopActions>
        </TopPanelInner>
      </TopPanel>

      <Header>
        <HeaderInner>
          <LogoLink href="#home" aria-label="JB Motos">
            <img src={logo} alt="JB Motos" />
          </LogoLink>
          <Nav aria-label="Menu da loja">
            <a href="#home" aria-current="page">Início</a>
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

      <Hero id="home">
        {heroSlides.map((slide) => (
          <HeroSlide
            key={slide.title}
            $image={slide.image}
            $delay={slide.delay}
            aria-hidden="true"
          />
        ))}
        <HeroContent>
          <h1>{heroAtual.title}</h1>
          <p>{heroAtual.subtitle}</p>
          <Button as={Link} to="/loja/catalogo">
            Ver produtos
          </Button>
        </HeroContent>
      </Hero>

      <Section id="promocoes">
        <Container>
          <BannerGrid>
            <BannerCard $image={gallery2}>
              <div>
                <h3>Modelos esportivos</h3>
                <p>Manutenção e peças para motos esportivas atendidas na oficina.</p>
                <Button as={Link} to="/loja/catalogo">
                  Ver produtos
                </Button>
              </div>
            </BannerCard>
            <BannerCard $image={gallery3}>
              <div>
                <h3>Custom e estrada</h3>
                <p>Serviços para modelos custom, touring e motos de uso diário.</p>
                <Button as={Link} to="/loja/servicos">
                  Ver serviços
                </Button>
              </div>
            </BannerCard>
          </BannerGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <GalleryGrid>
            <GalleryCard as={Link} to="/loja/catalogo" $image={gallery1}>
              <h3>Promoções mensais</h3>
            </GalleryCard>
            <GalleryCard as={Link} to="/loja/catalogo" $image={gallery2}>
              <h3>Novidades</h3>
            </GalleryCard>
            <GalleryCard as={Link} to="/loja/catalogo" $image={gallery3}>
              <h3>Promoções e Ofertas Especiais</h3>
            </GalleryCard>
          </GalleryGrid>
        </Container>
      </Section>

      <Section id="catalogo">
        <Container>
          <SectionHeading>Produtos populares</SectionHeading>
          <ProductGrid>
            {products.map((product) => (
              <ProductCard key={product.id}>
                <ProductImage>
                  <img src={product.image} alt={product.name} />
                  <img src={product.hoverImage} alt="" aria-hidden="true" />
                  {product.badge && (
                    <Badge $sale={product.badge === "oferta"}>
                      {product.badge}
                    </Badge>
                  )}
                </ProductImage>
                <ProductInfo>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <Price>
                    {product.oldPrice && <s>{product.oldPrice}</s>}
                    <span>{product.price}</span>
                  </Price>
                  <CardActions>
                    <button type="button" onClick={() => addToCart(product)}>
                      Adicionar ao carrinho
                    </button>
                    <button
                      type="button"
                      onClick={() => addWishlist(product)}
                      title="Adicionar à lista de desejos"
                    >
                      ♥
                    </button>
                  </CardActions>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductGrid>
        </Container>
      </Section>

      <OverlaySale $image={gallery1} id="servicos">
        <div>
          <h5>Oficina especializada</h5>
          <h2>Revisão e diagnóstico</h2>
          <h4>Modelos atendidos: Honda, Yamaha, Suzuki, custom e urbanas</h4>
                <Button as={Link} to="/loja/contato">
                  Solicitar atendimento
                </Button>
        </div>
      </OverlaySale>

      <Section>
        <Container>
          <BannerGrid>
            <BannerCard $image={helmet1} $align="left">
              <div>
                <h4>Oferta</h4>
                <h3>Capacetes</h3>
                <p>
                  Até <strong>25% de desconto</strong>
                </p>
                <Button as={Link} to="/loja/catalogo">
                  Ver acessórios
                </Button>
              </div>
            </BannerCard>
            <BannerCard $image={jacket1} $align="left">
              <div>
                <h4>Nova Coleção</h4>
                <h3>Equipamentos</h3>
                <p>Jaquetas, luvas, óculos e itens para pilotagem</p>
                <Button as={Link} to="/loja/catalogo">
                  Ver produtos
                </Button>
              </div>
            </BannerCard>
          </BannerGrid>
        </Container>
      </Section>

      <Section id="contato">
        <Container>
          <SectionHeading>Novidades do Blog</SectionHeading>
          <BlogGrid>
            <BlogCard>
              <span>Motocultura</span>
              <h3>A manutenção certa aumenta a vida útil da sua moto.</h3>
              <p>
                Peças, revisão e atendimento confiável para manter cada passeio
                seguro e cada cliente bem orientado pela oficina.
              </p>
            </BlogCard>
            <BlogCard>
              <span>Oficina</span>
              <h3>Serviço bem feito começa no diagnóstico correto.</h3>
              <p>
                Nossa loja une catálogo de peças, serviços e suporte para quem
                usa a moto no trabalho, lazer e rotina.
              </p>
            </BlogCard>
            <BlogCard>
              <span>Qualidade</span>
              <h3>Peças e acessórios com qualidade e preço justo.</h3>
              <p>
                Produtos selecionados, histórico de pedidos e cadastro do cliente
                preparados para a integração com o backend.
              </p>
            </BlogCard>
          </BlogGrid>
        </Container>
      </Section>

      <StoreFooter onNewsletter={() => showToast("Inscrição salva para teste.")} />
      <StoreCartAddedModal
        product={addedProduct}
        quantity={addedQuantity}
        onClose={() => setAddedProduct(null)}
      />

      {toast && <Toast>{toast}</Toast>}
    </Page>
  );
}
