import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import gallery1 from "@components/atoms/assets/mototab/gallery-1.jpg";
import gallery2 from "@components/atoms/assets/mototab/gallery-2.jpg";
import gallery3 from "@components/atoms/assets/mototab/gallery-3.jpg";
import {
  MegaMenuColumn,
  MegaMenuGrid,
  MegaMenuPanel,
  NavCatalogItem,
} from "../LojaHomePage/LojaHomePage.styles";

const columns = [
  {
    image: gallery1,
    links: [
      "Modelos atendidos",
      "Ajuste de moto",
      "Ofertas",
      "Serviços",
      "Peças",
      "Especiais para pilotos",
    ],
  },
  {
    image: gallery2,
    links: [
      "Especiais para pilotos",
      "Peças",
      "Serviços",
      "Ofertas",
      "Ajuste de moto",
      "Modelos atendidos",
    ],
  },
  {
    image: gallery2,
    links: [
      "Ofertas",
      "Ajuste de moto",
      "Modelos atendidos",
      "Serviços",
      "Peças",
      "Especiais para pilotos",
    ],
  },
  {
    image: gallery3,
    links: [
      "Peças",
      "Ofertas",
      "Modelos atendidos",
      "Ajuste de moto",
      "Serviços",
      "Especiais para pilotos",
    ],
  },
];

export function StoreMegaMenu() {
  const location = useLocation();
  const [closing, setClosing] = useState(false);
  const closeMenu = () => setClosing(true);
  const active = location.pathname === "/loja/catalogo";

  return (
    <NavCatalogItem
      data-closing={closing}
      onMouseLeave={() => setClosing(false)}
    >
      <Link
        to="/loja/catalogo"
        onClick={closeMenu}
        aria-current={active ? "page" : undefined}
      >
        Catálogo
      </Link>
      <MegaMenuPanel>
        <MegaMenuGrid>
          {columns.map((column, columnIndex) => (
            <MegaMenuColumn key={`${column.image}-${columnIndex}`}>
              <img src={column.image} alt="" aria-hidden="true" />
              {column.links.map((link) => (
                <Link key={link} to="/loja/catalogo" onClick={closeMenu}>
                  {link}
                </Link>
              ))}
            </MegaMenuColumn>
          ))}
        </MegaMenuGrid>
      </MegaMenuPanel>
    </NavCatalogItem>
  );
}
