import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#080808")};
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
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
    color: inherit;
    text-decoration: none;
  }
`;

export const Title = styled.h1`
  margin: 0 0 1.5rem;
  text-align: center;
  font-size: 1.05rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 950;
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

export const CartTable = styled.div`
  border-top: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.12)"};
  margin-top: 1.5rem;
`;

export const CartRow = styled.article`
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr) 120px 150px 120px;
  gap: 1rem;
  align-items: start;
  padding: 1rem 0;
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.12)"};

  &:last-child {
    border-bottom: none;
  }

  img {
    width: 180px;
    height: 160px;
    object-fit: contain;
    background: ${({ theme }) => (theme.mode === "light" ? "#fafafa" : "#151515")};
  }

  h3 {
    margin: 1.4rem 0 0.6rem;
    font-size: 0.9rem;
    font-weight: 500;
  }

  strong {
    color: #c41e1e;
  }

  @media (max-width: 760px) {
    grid-template-columns: 100px 1fr;

    > *:nth-child(n + 3) {
      grid-column: 2;
    }
  }
`;

export const ProductMeta = styled.p`
  margin: 0 0 0.9rem;
  color: ${({ theme }) => (theme.mode === "light" ? "#333" : "#d8d8d8")};
  font-size: 0.78rem;
  line-height: 1.5;
`;

export const RedBtn = styled.button`
  border: none;
  background: #d60000;
  color: #fff;
  min-height: 34px;
  padding: 0 0.95rem;
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 950;
  cursor: pointer;
`;

export const QuantityBox = styled.div`
  display: grid;
  gap: 0.5rem;
  justify-items: start;

  div {
    display: inline-grid;
    grid-template-columns: 32px 40px 32px;
    border: 1px solid
      ${({ theme }) =>
        theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.14)"};
  }

  button {
    border: none;
    background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
    color: inherit;
    font-weight: 950;
    cursor: pointer;
  }

  span {
    display: grid;
    place-items: center;
    min-height: 30px;
    border-inline: 1px solid
      ${({ theme }) =>
        theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.14)"};
  }
`;

export const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.12)"};
  padding: 1rem 0;
  font-size: 1rem;
`;

export const NoteBox = styled.label`
  display: grid;
  gap: 0.45rem;
  color: ${({ theme }) => (theme.mode === "light" ? "#777" : "#cfcfcf")};
  font-size: 0.8rem;

  textarea {
    width: 100%;
    min-height: 95px;
    border: 1px solid
      ${({ theme }) =>
        theme.mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.14)"};
    background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
    color: inherit;
    padding: 0.8rem;
    resize: vertical;
  }
`;

export const CartFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;

  a,
  button {
    border: none;
    background: #c41e1e;
    color: #fff;
    min-height: 38px;
    padding: 0 1.25rem;
    text-transform: uppercase;
    font-weight: 950;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
  }

  a:last-child {
    background: #221817;
  }
`;

export const PurchaseHistory = styled.section`
  margin-top: 2rem;
  border-top: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.12)"};
  padding-top: 1.25rem;
  display: grid;
  gap: 0.75rem;

  h2 {
    margin: 0 0 0.5rem;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  article {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.75rem;
    padding: 0.9rem;
    background: ${({ theme }) => (theme.mode === "light" ? "#fafafa" : "#111")};
    border: 1px solid
      ${({ theme }) =>
        theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.12)"};
  }

  div {
    display: grid;
    gap: 0.2rem;
    min-width: 0;
  }

  span,
  p {
    color: ${({ theme }) => (theme.mode === "light" ? "#555" : "#cfcfcf")};
    font-size: 0.8rem;
  }

  p {
    grid-column: 1 / -1;
    margin: 0;
  }
`;
