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
  margin-bottom: 3rem;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export const Title = styled.h1`
  margin: 0 0 2.1rem;
  text-align: center;
  font-size: 1.05rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 950;
`;

export const ServiceGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(2rem, 7vw, 5rem);
  margin-bottom: 4rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const ServiceCard = styled.article`
  i {
    color: #c41e1e;
    font-size: 2rem;
    margin-bottom: 1.3rem;
    display: inline-block;
  }

  h2 {
    margin: 0 0 0.65rem;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-weight: 950;
  }

  p {
    margin: 0 0 1rem;
    color: ${({ theme }) => (theme.mode === "light" ? "#222" : "#d7d7d7")};
    font-size: 0.88rem;
    line-height: 1.75;
  }

  ul {
    margin: 0;
    padding-left: 1rem;
    color: ${({ theme }) => (theme.mode === "light" ? "#222" : "#d7d7d7")};
    font-size: 0.84rem;
    line-height: 1.8;
  }
`;

export const ServiceProductsSection = styled.section`
  border-top: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.12)"};
  padding-top: 2.2rem;
  margin-bottom: 4rem;

  > p {
    max-width: 760px;
    margin: -1rem auto 2rem;
    text-align: center;
    color: ${({ theme }) => (theme.mode === "light" ? "#555" : "#cfcfcf")};
    font-size: 0.9rem;
    line-height: 1.6;
  }
`;

export const ServiceProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const ServiceProductCard = styled.article`
  border: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.12)"};
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
  overflow: hidden;

  img {
    width: 100%;
    height: 190px;
    object-fit: contain;
    background: ${({ theme }) => (theme.mode === "light" ? "#f6f6f6" : "#171717")};
    display: block;
  }

  div {
    padding: 0.9rem;
  }

  h2 {
    margin: 0 0 0.55rem;
    min-height: 42px;
    font-size: 0.9rem;
    line-height: 1.35;
  }

  p {
    margin: 0 0 0.75rem;
    min-height: 52px;
    color: ${({ theme }) => (theme.mode === "light" ? "#555" : "#cfcfcf")};
    font-size: 0.78rem;
    line-height: 1.45;
  }

  strong {
    display: block;
    margin-bottom: 0.85rem;
    color: #c41e1e;
  }

  button {
    width: 100%;
    min-height: 36px;
    border: none;
    background: #c41e1e;
    color: #fff;
    text-transform: uppercase;
    font-size: 0.7rem;
    font-weight: 950;
    cursor: pointer;
  }
`;

export const RequestSection = styled.section`
  border-top: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.12)"};
  padding-top: 2.2rem;
`;

export const SelectedProducts = styled.div`
  border: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(196, 30, 30, 0.25)" : "rgba(255, 255, 255, 0.16)"};
  background: ${({ theme }) => (theme.mode === "light" ? "#fff7f7" : "#160b0b")};
  padding: 0.85rem;

  h3 {
    margin: 0 0 0.6rem;
    color: ${({ theme }) => (theme.mode === "light" ? "#7f1d1d" : "#ffd6d6")};
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  ul {
    margin: 0;
    padding-left: 1rem;
    color: ${({ theme }) => (theme.mode === "light" ? "#7f1d1d" : "#ffd6d6")};
    font-size: 0.82rem;
    line-height: 1.6;
  }
`;

export const RequestLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 460px) minmax(0, 1fr);
  gap: 2rem;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const RequestImage = styled.img`
  width: 100%;
  height: 320px;
  object-fit: cover;
  display: block;
`;

export const RequestForm = styled.form`
  display: grid;
  gap: 1rem;

  h2 {
    margin: 0 0 0.3rem;
    font-size: 0.95rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 950;
  }

  p {
    margin: 0 0 0.6rem;
    color: ${({ theme }) => (theme.mode === "light" ? "#444" : "#d4d4d4")};
    font-size: 0.88rem;
    line-height: 1.6;
  }

  label {
    display: grid;
    gap: 0.35rem;
    font-size: 0.78rem;
    color: ${({ theme }) => (theme.mode === "light" ? "#555" : "#d7d7d7")};
    font-weight: 800;
  }

  input,
  textarea {
    width: 100%;
    border: 1.5px solid
      ${({ theme }) =>
        theme.mode === "light" ? "rgba(0, 0, 0, 0.28)" : "rgba(255, 255, 255, 0.34)"};
    background: ${({ theme }) => (theme.mode === "light" ? "#fbfbfb" : "#121212")};
    color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
    padding: 0.78rem 0.85rem;
    font-size: 0.9rem;
    outline: none;

    &::placeholder {
      color: ${({ theme }) => (theme.mode === "light" ? "#5d6673" : "#b8bec8")};
      opacity: 1;
    }

    &:focus {
      border-color: #c41e1e;
      box-shadow: 0 0 0 3px rgba(196, 30, 30, 0.16);
      background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#171717")};
    }
  }

  textarea {
    min-height: 126px;
    resize: vertical;
  }

  button {
    justify-self: start;
    border: none;
    background: #c41e1e;
    color: #fff;
    min-height: 40px;
    padding: 0 1.25rem;
    font-weight: 950;
    text-transform: uppercase;
    cursor: pointer;
  }
`;

export const MotoHint = styled.div`
  border-left: 3px solid #c41e1e;
  background: ${({ theme }) => (theme.mode === "light" ? "#fff7f7" : "#160b0b")};
  color: ${({ theme }) => (theme.mode === "light" ? "#7f1d1d" : "#ffd6d6")};
  padding: 0.75rem 0.85rem;
  font-size: 0.82rem;
  line-height: 1.5;
`;
