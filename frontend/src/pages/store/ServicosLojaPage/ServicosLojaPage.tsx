import { useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import { ThemeToggle } from "@components/molecules/ThemeToggle";
import logo from "@components/atoms/assets/Logo.JBmotos.svg";
import gallery1 from "@components/atoms/assets/mototab/gallery-1.jpg";
import gloves1 from "@components/atoms/assets/mototab/gloves-classic-1.png";
import gloves2 from "@components/atoms/assets/mototab/gloves-classic-2.png";
import helmet1 from "@components/atoms/assets/mototab/helmet-whisper-1.png";
import helmet2 from "@components/atoms/assets/mototab/helmet-whisper-2.png";
import jacket1 from "@components/atoms/assets/mototab/jacket-atomic-1.png";
import jacket2 from "@components/atoms/assets/mototab/jacket-atomic-2.png";
import goggles1 from "@components/atoms/assets/mototab/goggles-buzzard-1.png";
import goggles2 from "@components/atoms/assets/mototab/goggles-buzzard-2.png";
import type { CartItem, LojaProduct } from "../lojaTypes";
import { StoreAccountLink } from "../StoreAccountLink";
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
  Breadcrumb,
  Content,
  MotoHint,
  Page,
  RequestForm,
  RequestImage,
  RequestLayout,
  RequestSection,
  SelectedProducts,
  ServiceCard,
  ServiceGrid,
  ServiceProductCard,
  ServiceProductsGrid,
  ServiceProductsSection,
  Title,
} from "./ServicosLojaPage.styles";

type RegisteredMoto = {
  modelo?: string;
  marca?: string;
  placa?: string;
  id?: string;
};

const STORAGE_CART = "jb-motos-store-cart";
const STORAGE_MOTOS = "jb-motos-client-motos";

const services = [
  {
    icon: "cash-coin",
    title: "Cobrança do serviço",
    text: "A JB Motos avalia a moto primeiro e informa o orçamento antes de executar. A cobrança pode envolver mão de obra, peças usadas e urgência do atendimento.",
    items: [
      "Diagnóstico inicial informado ao cliente",
      "Peças cobradas conforme necessidade",
      "Serviço só segue após aprovação",
      "Registro para acompanhar a ordem de serviço",
    ],
  },
  {
    icon: "tags",
    title: "Produtos e peças",
    text: "Quando o reparo precisar de produto do estoque, a oficina separa a peça correta e vincula tudo à solicitação para facilitar o controle administrativo.",
    items: [
      "Peças de reposição",
      "Acessórios para piloto",
      "Itens de revisão e manutenção",
      "Produtos conferidos antes da instalação",
    ],
  },
  {
    icon: "tools",
    title: "Serviços da oficina",
    text: "A oficina realiza revisão, ajuste, diagnóstico e manutenção para modelos atendidos pela JB Motos, sempre registrando o problema relatado pelo cliente.",
    items: [
      "Revisão preventiva",
      "Ajuste e manutenção",
      "Diagnóstico de falhas",
      "Solicitação de ordem de serviço online",
    ],
  },
];

const serviceProducts: LojaProduct[] = [
  {
    id: "servico-corrente-transmissao",
    name: "Corrente de transmissão para revisão",
    price: "R$ 320,00",
    description:
      "Peça usada em manutenção de transmissão, troca preventiva e correção de folga.",
    image: gloves1,
    hoverImage: gloves2,
    badge: "novo",
  },
  {
    id: "servico-chicote-freio",
    name: "Chicote e cabo de freio",
    price: "R$ 137,00",
    description:
      "Peça para reparo no sistema de freio, ajuste e substituição durante o serviço.",
    image: jacket1,
    hoverImage: jacket2,
    badge: "novo",
  },
  {
    id: "servico-pedal-reposicao",
    name: "Pedal de reposição",
    price: "R$ 559,00",
    description:
      "Peça para troca de pedal danificado, ajuste de encaixe e revisão do conjunto.",
    image: helmet1,
    hoverImage: helmet2,
    badge: "novo",
  },
  {
    id: "servico-catraca-moto",
    name: "Catraca e conjunto de tração",
    price: "R$ 559,00",
    description:
      "Peça para serviço de transmissão, avaliação de desgaste e substituição.",
    image: goggles1,
    hoverImage: goggles2,
    badge: "oferta",
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

export function ServicosLojaPage() {
  const registeredMotos = useMemo(readRegisteredMotos, []);
  const [cartItems, setCartItems] = useState<CartItem[]>(readCart);
  const [addedProduct, setAddedProduct] = useState<LojaProduct | null>(null);
  const [addedQuantity, setAddedQuantity] = useState(1);
  const [nome, setNome] = useState("");
  const [modelo, setModelo] = useState("");
  const [toast, setToast] = useState("");
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const motoSugerida = nome.trim() ? registeredMotos[0] : undefined;

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showToast("Solicitação de ordem de serviço enviada para teste.");
    event.currentTarget.reset();
    setNome("");
    setModelo("");
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
            <Link to="/loja/servicos" aria-current="page">Serviços</Link>
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
            <strong>Serviços</strong>
          </Breadcrumb>

          <Title>Serviços</Title>

          <ServiceGrid>
            {services.map((service) => (
              <ServiceCard key={service.title}>
                <Icon name={service.icon} size={32} color="currentColor" />
                <h2>{service.title}</h2>
                <p>{service.text}</p>
                <ul>
                  {service.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ServiceCard>
            ))}
          </ServiceGrid>

          <ServiceProductsSection>
            <Title>Peças e produtos para o serviço</Title>
            <p>
              O cliente pode escolher a peça ou acessório relacionado ao serviço.
              Ao solicitar, o item vai para o carrinho e aparece vinculado à
              solicitação de ordem de serviço abaixo.
            </p>
            <ServiceProductsGrid>
              {serviceProducts.map((product) => (
                <ServiceProductCard key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <strong>{product.price}</strong>
                    <button type="button" onClick={() => addToCart(product)}>
                      Solicitar peça
                    </button>
                  </div>
                </ServiceProductCard>
              ))}
            </ServiceProductsGrid>
          </ServiceProductsSection>

          <RequestSection>
            <Title>Solicitar ordem de serviço</Title>
            <RequestLayout>
              <RequestImage src={gallery1} alt="Moto na oficina JB Motos" />
              <RequestForm onSubmit={handleSubmit}>
                <h2>Conte o problema da sua moto</h2>
                <p>
                  Informe seus dados, o modelo da moto e descreva o defeito. Se
                  a moto já estiver registrada, o modelo pode aparecer como
                  sugestão para agilizar a abertura da OS.
                </p>
                <label>
                  Nome do cliente *
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    placeholder="Digite seu nome *"
                  />
                </label>
                {motoSugerida && (
                  <MotoHint>
                    Moto cadastrada encontrada:{" "}
                    <strong>
                      {motoSugerida.modelo}
                      {motoSugerida.marca ? ` - ${motoSugerida.marca}` : ""}
                      {motoSugerida.placa ? ` - ${motoSugerida.placa}` : ""}
                    </strong>
                    . O sistema usa esses dados para relacionar a moto às peças
                    escolhidas.
                  </MotoHint>
                )}
                {cartItems.length > 0 && (
                  <SelectedProducts>
                    <h3>Produtos vinculados à solicitação</h3>
                    <ul>
                      {cartItems.map((item) => (
                        <li key={item.id}>
                          {item.name} - Quantidade: {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </SelectedProducts>
                )}
                <label>
                  Modelo da moto *
                  <input
                    type="text"
                    required
                    value={modelo}
                    onChange={(event) => setModelo(event.target.value)}
                    placeholder={motoSugerida?.modelo || "Ex.: Honda CG 160 *"}
                  />
                </label>
                <label>
                  Foto da moto ou do problema
                  <input type="file" accept="image/*" />
                </label>
                <label>
                  Qual problema está acontecendo? *
                  <textarea
                    required
                    placeholder="Descreva barulho, falha, vazamento, peça quebrada ou qualquer detalhe importante."
                  />
                </label>
                <button type="submit">Solicitar ordem de serviço</button>
              </RequestForm>
            </RequestLayout>
          </RequestSection>
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
