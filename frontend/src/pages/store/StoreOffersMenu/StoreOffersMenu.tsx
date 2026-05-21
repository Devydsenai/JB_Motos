import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import glasses from "@components/atoms/assets/mototab/glasses-3pair-1.png";
import gloves from "@components/atoms/assets/mototab/gloves-classic-1.png";
import helmet from "@components/atoms/assets/mototab/helmet-whisper-1.png";
import rogue from "@components/atoms/assets/mototab/helmet-rogue-1.png";
import {
  MegaMenuColumn,
  MegaMenuGrid,
  MegaMenuPanel,
  NavCatalogItem,
} from "../LojaHomePage/LojaHomePage.styles";

const offers = [
  {
    image: glasses,
    label: "Ofertas em óculos",
  },
  {
    image: rogue,
    label: "Capacetes em promoção",
  },
  {
    image: helmet,
    label: "Acessórios selecionados",
  },
  {
    image: gloves,
    label: "Luvas e proteção",
  },
];

export function StoreOffersMenu() {
  const location = useLocation();
  const [closing, setClosing] = useState(false);
  const closeMenu = () => setClosing(true);
  const active = location.pathname === "/loja/ofertas";

  return (
    <NavCatalogItem
      data-closing={closing}
      onMouseLeave={() => setClosing(false)}
    >
      <Link
        to="/loja/ofertas"
        onClick={closeMenu}
        aria-current={active ? "page" : undefined}
      >
        Ofertas
      </Link>
      <MegaMenuPanel>
        <MegaMenuGrid>
          {offers.map((offer) => (
            <MegaMenuColumn key={offer.label}>
              <img src={offer.image} alt="" aria-hidden="true" />
              <Link to="/loja/ofertas" onClick={closeMenu}>
                {offer.label}
              </Link>
            </MegaMenuColumn>
          ))}
        </MegaMenuGrid>
      </MegaMenuPanel>
    </NavCatalogItem>
  );
}
