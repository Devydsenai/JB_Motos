import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import {
  Footer,
  FooterColumn,
  FooterColumns,
  FooterNewsletter,
  ScrollTopButton,
} from "../LojaHomePage/LojaHomePage.styles";

type StoreFooterProps = {
  onNewsletter?: () => void;
};

const categories = [
  "Peças de reposição",
  "Ajuste de moto",
  "Serviços",
  "Ofertas",
  "Acessórios",
  "Equipamentos para pilotos",
  "Vestuário",
];

export function StoreFooter({ onNewsletter }: StoreFooterProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShowScrollTop(window.scrollY > 280);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onNewsletter?.();
    event.currentTarget.reset();
  };

  return (
    <Footer>
      <FooterNewsletter>
        <h2>Receba as últimas notícias diariamente</h2>
        <p>
          Receba novidades da JB Motos, avisos de promoções em peças, acessórios
          e dicas de manutenção para cuidar melhor da sua moto.
        </p>
        <form onSubmit={handleSubmit}>
          <input type="email" required placeholder="Insira seu e-mail" />
          <button type="submit">Inscreva-se</button>
        </form>
      </FooterNewsletter>

      <FooterColumns>
        <FooterColumn>
          <h3>Sobre a nossa empresa</h3>
          <p>
            A JB Motos é uma oficina e loja de peças para motocicletas. Nosso
            foco é manutenção, diagnóstico, acessórios e atendimento para quem
            usa a moto no trabalho, lazer ou rotina. Não vendemos motos:
            cuidamos da sua moto e oferecemos produtos para manter tudo em dia.
          </p>
        </FooterColumn>

        <FooterColumn>
          <h3>Categorias</h3>
          <ul>
            {categories.map((category) => (
              <li key={category}>
                <Link to={category === "Ofertas" ? "/loja/ofertas" : "/loja/catalogo"}>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn>
          <h3>Informação</h3>
          <ul>
            <li>
              <Link to="/loja/contato">Sobre nós</Link>
            </li>
            <li>
              <Link to="/loja/catalogo">Catálogo</Link>
            </li>
            <li>
              <Link to="/loja/contato">Contate-nos</Link>
            </li>
            <li>
              <Link to="/loja/favoritos">Favoritos</Link>
            </li>
            <li>
              <Link to="/loja/servicos">Serviços</Link>
            </li>
            <li>
              <Link to="/loja/contato">Política de privacidade</Link>
            </li>
          </ul>
        </FooterColumn>

        <FooterColumn>
          <h3>Minha conta</h3>
          <ul>
            <li>
              <Link to="/loja/minha-conta">Minha conta</Link>
            </li>
            <li>
              <Link to="/loja/minha-conta">Conecte-se</Link>
            </li>
            <li>
              <Link to="/loja/minha-conta">Minhas motos</Link>
            </li>
            <li>
              <Link to="/loja/carrinho">Meu carrinho</Link>
            </li>
            <li>
              <Link to="/loja/servicos">Solicitar serviço</Link>
            </li>
            <li>
              <Link to="/loja/contato">Últimas notícias</Link>
            </li>
          </ul>
        </FooterColumn>
      </FooterColumns>

      {showScrollTop && (
        <ScrollTopButton
          type="button"
          aria-label="Voltar ao topo"
          onClick={() => {
            setShowScrollTop(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <Icon name="chevron-up" size={18} color="currentColor" />
        </ScrollTopButton>
      )}
    </Footer>
  );
}
