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
  margin-bottom: 2.6rem;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export const Title = styled.h1`
  margin: 0 0 2.2rem;
  text-align: center;
  font-size: 1.05rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 950;
`;

export const CatalogGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;

  @media (max-width: 920px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const CatalogCard = styled.article`
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
  border: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)"};
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(196, 30, 30, 0.65);
  }
`;

export const CatalogImage = styled.div`
  height: 220px;
  display: grid;
  place-items: center;
  background: ${({ theme }) => (theme.mode === "light" ? "#f5f5f5" : "#161616")};
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)"};

  img {
    max-width: 88%;
    max-height: 88%;
    object-fit: contain;
    display: block;
  }
`;

export const CatalogInfo = styled.div`
  padding: 1rem;

  span {
    display: inline-flex;
    margin-bottom: 0.65rem;
    color: #c41e1e;
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-weight: 950;
  }

  h2 {
    margin: 0 0 0.55rem;
    font-size: 1rem;
    line-height: 1.25;
    text-transform: uppercase;
    font-weight: 950;
  }

  p {
    margin: 0 0 1rem;
    min-height: 58px;
    color: ${({ theme }) => (theme.mode === "light" ? "#555" : "#cfcfcf")};
    font-size: 0.84rem;
    line-height: 1.55;
  }

  a {
    display: inline-flex;
    min-height: 34px;
    align-items: center;
    padding: 0 0.9rem;
    background: #c41e1e;
    color: #fff;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 0.68rem;
    font-weight: 950;
  }
`;
