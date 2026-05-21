import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: #fff;
  color: #111;
  padding: 2rem;

  @media (max-width: 760px) {
    padding: 1rem;
  }
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  margin-bottom: 2.4rem;

  a {
    color: #111;
    text-decoration: none;
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 2.5rem;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.aside`
  h2 {
    margin: 0 0 1.2rem;
    font-size: 0.9rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-weight: 950;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.8rem;
    font-size: 0.82rem;
  }

  a {
    color: #222;
    text-decoration: none;
  }

  a:hover {
    color: #c41e1e;
  }
`;

export const Content = styled.main`
  h1 {
    margin: 0 0 1.5rem;
    text-align: center;
    font-size: 1.05rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-weight: 950;
  }
`;

export const Alert = styled.div`
  background: #fff4bf;
  border: 1px solid #f4e38a;
  color: #6d5a00;
  padding: 0.8rem 1rem;
  font-size: 0.82rem;

  a {
    color: inherit;
    text-decoration: underline;
  }
`;

export const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const FavoriteCard = styled.article`
  border: 1px solid #e5e7eb;
  background: #fff;

  img {
    width: 100%;
    height: 180px;
    object-fit: contain;
    background: #fafafa;
    border-bottom: 1px solid #e5e7eb;
  }

  div {
    padding: 0.85rem;
  }

  h3 {
    margin: 0 0 0.6rem;
    min-height: 38px;
    font-size: 0.86rem;
    line-height: 1.35;
  }

  strong {
    color: #c41e1e;
    font-size: 1rem;
  }

  button {
    width: 100%;
    margin-top: 0.8rem;
    min-height: 34px;
    border: none;
    background: #c41e1e;
    color: #fff;
    font-size: 0.72rem;
    font-weight: 950;
    text-transform: uppercase;
    cursor: pointer;
  }
`;
