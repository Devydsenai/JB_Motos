import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "@components/atoms/Button";
import { Text } from "@components/atoms/Text";


// STYLED COMPONENTS (Design Premium Imersivo - Adaptável ao Tema)


const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5rem;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text || "#ffffff"};
  font-family: 'Inter', 'Montserrat', sans-serif;
  margin: -2rem -1.5rem;
  padding: 0;
  overflow-x: hidden;
`;


// CARROSSEL 

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  height: 520px;
  background: #000;
  overflow: hidden;
  border-bottom: 3px solid #C41E1E;
`;

const CarouselTrack = styled.div<{ $activeIndex: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-${({ $activeIndex }) => $activeIndex * 100}%);
`;

const CarouselSlide = styled.div<{ $bgUrl: string }>`
  min-width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 10%;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.85) 40%, rgba(0, 0, 0, 0.3) 100%), url(${({ $bgUrl }) => $bgUrl});
  background-size: cover;
  background-position: center;
`;

const CarouselContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 600px;
  animation: fadeIn 1s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const CarouselNav = styled.button<{ $position: "left" | "right" }>`
  position: absolute;
  top: 50%;
  ${({ $position }) => ($position === "left" ? "left: 30px;" : "right: 30px;")}
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 1.2rem;

  &:hover {
    background: #C41E1E;
    border-color: #C41E1E;
    transform: translateY(-50%) scale(1.05);
  }
`;

const CarouselDots = styled.div`
  position: absolute;
  bottom: 25px;
  left: 10%;
  display: flex;
  gap: 0.75rem;
  z-index: 10;
`;

const Dot = styled.span<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "30px" : "8px")};
  height: 8px;
  border-radius: 4px;
  background: ${({ $active }) => ($active ? "#C41E1E" : "rgba(255, 255, 255, 0.4)")};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;


// VITRINE DE PRODUTOS/SERVIÇOS 

const ProductsSection = styled.section`
  padding: 0 8%;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const SectionHeader = styled.div`
  margin-bottom: 3.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  &::after {
    content: '';
    width: 50px;
    height: 3px;
    background: #C41E1E;
    margin-top: 1rem;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  gap: 2.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const ProductCard = styled.article`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.05)"};
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(196, 30, 30, 0.15);
    border-color: rgba(196, 30, 30, 0.3);
  }
`;

const CardImageContainer = styled.div`
  height: 200px;
  width: 100%;
  overflow: hidden;
  position: relative;
  background: #1a1a1a;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${ProductCard}:hover & {
    transform: scale(1.06);
  }
`;

const CardBadge = styled.span`
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  color: #fff;
  border-left: 3px solid #C41E1E;
  padding: 0.3rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 0 4px 4px 0;
`;

const ProductInfo = styled.div`
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`;

const PriceTag = styled.div`
  font-size: 1.4rem;
  font-weight: 800;
  color: #C41E1E;
  margin-top: auto;
  border-top: 1px solid ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.05)"};
  padding-top: 1rem;
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
`;


// PREMIUM SHOPIFY FOOTER 

const CustomFooter = styled.footer`
  background: #11141a;
  color: #b5b8bc;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  margin-top: auto;
`;

const FooterTop = styled.div`
  padding: 5rem 8% 4rem 8%;
`;

const FooterGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 4rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const FooterCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h3 {
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    color: #ffffff;
    margin: 0;
    letter-spacing: 0.08em;
    position: relative;
    padding-bottom: 0.5rem;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 30px;
      height: 2px;
      background: #C41E1E;
    }
  }

  p {
    color: #8a8f98;
    line-height: 1.7;
    margin: 0;
    font-size: 0.92rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  a, span.link-mock {
    color: #b5b8bc;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
    display: inline-flex;
    align-items: center;

    &:hover {
      color: #ffffff;
      transform: translateX(4px);
    }
  }
`;

const FooterBottom = styled.div`
  background: #0b0c10;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
  padding: 1.75rem 8%;
`;

const FooterBottomContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.8rem;
  color: #666e7a;

  a {
    color: #8a8f98;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      color: #C41E1E;
    }
  }
`;


// MOCKS DE INFORMAÇÕES (Banners )

const CAROUSEL_SLIDES = [
  {
    title: "Agilidade Máxima em Ordens de Serviço",
    desc: "Chega de fichas de papel rasgadas ou perdidas. Cadastre sua moto, vincule ao seu perfil e acompanhe diagnósticos e atualizações automáticas em tempo real de onde estiver.",
    badge: "MOTO RÁPIDA DIGITAL",
    imageUrl: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=1400"
  },
  {
    title: "Transparência Total nos Insumos e Peças",
    desc: "Cálculo matemático inteligente baseado na tabela de valores unitários oficiais. Cruzamos mão de obra do especialista com peças aplicadas sem taxas ocultas.",
    badge: "SISTEMA HOMOLOGADO SCORPION",
    imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1400"
  }
];

const SERVICOS_OFERTADOS = [
  { 
    id: 1, 
    nome: "Diagnóstico Computadorizado & Triagem Geral", 
    preco: "Sob Análise", 
    categoria: "Mão de Obra",
    desc: "Varredura completa e abertura imediata de OS com vinculação de dados do proprietário, placa e histórico anterior.",
    img: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: 2, 
    nome: "Substituição de Kit Transmissão de Alta Performance", 
    preco: "Consulte o Balcão", 
    categoria: "Peças Cadastradas",
    desc: "Instalação e alinhamento milimétrico de correntes, coroas e pinhões novos com rastreabilidade total no sistema.",
    img: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: 3, 
    nome: "Troca Preventiva de Lubrificantes Premium", 
    preco: "R$ 69,90", 
    categoria: "Peças Cadastradas",
    desc: "Substituição ágil utilizando fluidos homologados conforme as especificações diretas de fábrica da sua moto.",
    img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: 4, 
    nome: "Revisão e Sangria do Sistema de Freios ABS", 
    preco: "R$ 140,00", 
    categoria: "Manutenção Corretiva",
    desc: "Troca de pastilhas estruturais e fluidos hidráulicos para assegurar a máxima resposta de frenagem nas pistas ou ruas.",
    img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400"
  }
];


// COMPONENTE PRINCIPAL

export function LojaHomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === CAROUSEL_SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleGoToPedido = () => {
    navigate("/loja/pedido");
  };

  return (
    <PageWrapper>
      
      {/* CARROSSEL */}
      <CarouselContainer>
        <CarouselNav $position="left" onClick={() => setCurrentSlide(prev => prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1)}>⟵</CarouselNav>
        <CarouselNav $position="right" onClick={() => setCurrentSlide(prev => prev === CAROUSEL_SLIDES.length - 1 ? 0 : prev + 1)}>⟶</CarouselNav>
        
        <CarouselTrack $activeIndex={currentSlide}>
          {CAROUSEL_SLIDES.map((slide, index) => (
            <CarouselSlide key={index} $bgUrl={slide.imageUrl}>
              <CarouselContent>
                <div style={{ display: "flex" }}>
                  <span style={{ background: "#C41E1E", color: "#ffffff", padding: "0.3rem 0.6rem", fontSize: "0.65rem", fontWeight: 700, borderRadius: "2px", letterSpacing: "0.08em" }}>
                    {slide.badge}
                  </span>
                </div>
                <Text as="h3" style={{ fontSize: "2.75rem", fontWeight: 900, textTransform: "uppercase", lineHeight: 1.1, color: "#fff", margin: 0 }}>
                  {slide.title}
                </Text>
                <Text as="p" style={{ fontSize: "1rem", lineHeight: 1.6, color: "#e1e3e6", margin: 0, fontWeight: 400 }}>
                  {slide.desc}
                </Text>
                <div style={{ marginTop: "1rem" }}>
                  <Button size="md" variant="primary" onClick={handleGoToPedido} style={{ background: "#C41E1E", border: "1px solid #C41E1E", fontWeight: 700, padding: "0.8rem 2rem" }}>
                    AGENDAR MANUTENÇÃO ONLINE
                  </Button>
                </div>
              </CarouselContent>
            </CarouselSlide>
          ))}
        </CarouselTrack>

        <CarouselDots>
          {CAROUSEL_SLIDES.map((_, index) => (
            <Dot key={index} $active={currentSlide === index} onClick={() => setCurrentSlide(index)} />
          ))}
        </CarouselDots>
      </CarouselContainer>

      {/* VITRINE DE PRODUTOS E SERVIÇOS*/}
      <ProductsSection>
        <SectionHeader>
          <Text as="h3" style={{ fontSize: "2rem", fontWeight: 800, textTransform: "uppercase", margin: 0, letterSpacing: "0.02em" }}>
            Serviços Especializados
          </Text>
          <Text as="p" style={{ fontSize: "0.95rem", marginTop: "0.25rem", opacity: 0.6 }}>
            Selecione a intervenção mecânica ideal catalogada pela Scorpion Serviços LTDA
          </Text>
        </SectionHeader>

        <ProductsGrid>
          {SERVICOS_OFERTADOS.map((item) => (
            <ProductCard key={item.id}>
              <CardImageContainer>
                <CardBadge>{item.categoria}</CardBadge>
                <CardImage src={item.img} alt={item.nome} />
              </CardImageContainer>
              <ProductInfo>
                <Text as="h3" style={{ fontWeight: 700, fontSize: "1.15rem", margin: 0, lineHeight: 1.3 }}>
                  {item.nome}
                </Text>
                <Text as="p" style={{ fontSize: "0.85rem", opacity: 0.6, lineHeight: 1.5, margin: 0 }}>
                  {item.desc}
                </Text>
                <PriceTag>
                  <span style={{ fontSize: "0.8rem", fontWeight: 400, color: "#888" }}>Valor:</span>
                  {item.preco}
                </PriceTag>
                <Button size="sm" variant="outline" fullWidth onClick={handleGoToPedido} style={{ marginTop: "0.5rem", borderColor: "rgba(196, 30, 30, 0.5)", fontWeight: 600 }}>
                  Solicitar este item
                </Button>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
      </ProductsSection>

      {/*FOOTER */}
      <CustomFooter>
        <FooterTop>
          <FooterGrid>
            
            <FooterCol>
              <h3>Sobre a nossa empresa</h3>
              <p>
                Aqui na JB Motos, garantimos a total satisfação de qualquer cliente que visite nossa loja online. 
                É difícil encontrar um atendimento mais confiável e rigoroso do que o nosso. Considerando nossa vasta 
                experiência no setor de mecânica, montagem e automação de ordens de serviço, afirmamos que é impossível nos superar neste ramo.
              </p>
            </FooterCol>

            <FooterCol>
              <h3>Categorias</h3>
              <ul>
                <li><span className="link-mock" onClick={() => navigate("/loja")}>Fabricante de Peças</span></li>
                <li><span className="link-mock" onClick={() => navigate("/loja")}>Ajuste de Moto</span></li>
                <li><span className="link-mock" onClick={() => navigate("/loja")}>Ofertas Ativas</span></li>
                <li><span className="link-mock" onClick={() => navigate("/loja")}>Serviços do Catálogo</span></li>
                <li><span className="link-mock" onClick={() => navigate("/loja")}>Peças de Reposição</span></li>
              </ul>
            </FooterCol>

            <FooterCol>
              <h3>Informação</h3>
              <ul>
                <li><span className="link-mock" onClick={() => navigate("/loja")}>Sobre nós</span></li>
                <li><span className="link-mock" onClick={() => navigate("/loja")}>Catálogo Geral</span></li>
                <li><span className="link-mock" onClick={() => navigate("/loja")}>Contate-nos</span></li>
                <li><span className="link-mock" onClick={() => navigate("/loja")}>Diretrizes de Privacidade</span></li>
              </ul>
            </FooterCol>

            <FooterCol>
              <h3>Minha conta</h3>
              <ul>
                <li><span className="link-mock" onClick={() => navigate("/loja/minha-conta")}>Painel do Cliente</span></li>
                <li>Área do Mecânico</li>
                <li><span className="link-mock" onClick={handleGoToPedido}>Meus pedidos</span></li>
                <li><span className="link-mock" onClick={() => navigate("/loja")}>Últimas Notícias</span></li>
              </ul>
            </FooterCol>

          </FooterGrid>
        </FooterTop>

        <FooterBottom>
          <FooterBottomContainer>
            <span>© 2026 JB Motos. Todos os direitos reservados.</span>
            <span>
              Desenvolvido por <a target="_blank" rel="noopener noreferrer" href="https://github.com/Devydsenai/JB_Motos">Scorpion Serviços LTDA</a>
            </span>
          </FooterBottomContainer>
        </FooterBottom>
      </CustomFooter>

    </PageWrapper>
  );
}