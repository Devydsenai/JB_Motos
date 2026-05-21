import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#080808")};
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
  padding: 2rem 1.5rem 4rem;
`;

export const Content = styled.div`
  max-width: 1120px;
  margin: 0 auto;
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  margin-bottom: 2.2rem;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 2.2rem;

  @media (max-width: 940px) {
    grid-template-columns: 1fr;
  }
`;

export const Title = styled.h1`
  margin: 0 0 1.8rem;
  text-align: center;
  font-size: 1.05rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 950;
`;

export const MotoBox = styled.section`
  position: relative;
  margin-bottom: 2rem;
  min-height: 280px;
  overflow: hidden;
  background: ${({ theme }) => (theme.mode === "light" ? "#f5f5f5" : "#151515")};

  img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    display: block;
    filter: brightness(0.82);
  }

  div {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 1rem;
    text-align: center;
    color: #fff;
  }

  span,
  h2 {
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
    text-transform: uppercase;
  }

  span {
    display: block;
    margin-bottom: 0.35rem;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    font-weight: 950;
  }

  h2 {
    margin: 0;
    font-size: 1.2rem;
    letter-spacing: 0.08em;
    font-weight: 950;
  }

  p {
    position: absolute;
    left: 0.8rem;
    right: 0.8rem;
    bottom: 0.8rem;
    margin: 0;
    color: rgba(255, 255, 255, 0.88);
    font-size: 0.76rem;
    line-height: 1.4;
  }
`;

export const ProductsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.6rem;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

export const OfferCard = styled.article`
  position: relative;
`;

export const ProductImage = styled.div`
  position: relative;
  height: 270px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => (theme.mode === "light" ? "#f5f5f5" : "#151515")};

  img {
    max-width: 92%;
    max-height: 92%;
    object-fit: contain;
  }
`;

export const Badge = styled.span<{ $sale?: boolean }>`
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 58px;
  height: 58px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: ${({ $sale }) => ($sale ? "#d60000" : "#000")};
  color: #fff;
  font-size: 0.72rem;
  font-weight: 950;
  text-transform: lowercase;
  z-index: 2;

  & + & {
    left: 5rem;
  }
`;

export const ProductInfo = styled.div`
  padding-top: 1rem;

  h2 {
    min-height: 42px;
    margin: 0 0 0.7rem;
    font-size: 0.95rem;
    line-height: 1.4;
    font-weight: 500;
  }
`;

export const Price = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.85rem;
  color: #d60000;
  font-size: 0.95rem;

  s {
    color: #999;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;

  button {
    border: none;
    background: transparent;
    color: inherit;
    font-weight: 950;
    cursor: pointer;
  }

  div {
    display: flex;
    gap: 0.45rem;
  }
`;

export const Pager = styled.div`
  margin-top: 2.1rem;
  border: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.12)"};
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1rem;
  font-size: 0.9rem;

  nav {
    display: flex;
    gap: 0.85rem;
    font-weight: 800;
  }
`;

export const Sidebar = styled.aside`
  align-self: start;

  h2 {
    margin: 0 0 1.3rem;
    font-size: 0.95rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 950;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem;
    display: grid;
    gap: 1rem;
  }

  a {
    color: inherit;
    text-decoration: none;
    font-size: 0.92rem;
  }

  a:hover {
    color: #c41e1e;
  }
`;

export const SideProduct = styled.article`
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;

  img {
    width: 92px;
    height: 92px;
    object-fit: contain;
    background: ${({ theme }) => (theme.mode === "light" ? "#f5f5f5" : "#151515")};
  }

  h3 {
    margin: 0 0 0.35rem;
    font-size: 0.88rem;
    line-height: 1.35;
    font-weight: 500;
  }

  strong {
    display: block;
    margin-bottom: 0.45rem;
    color: #d60000;
    font-size: 0.9rem;
  }

  a {
    display: inline-flex;
    min-height: 30px;
    align-items: center;
    padding: 0 0.7rem;
    background: #c41e1e;
    color: #fff;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 0.66rem;
    font-weight: 950;
  }
`;
