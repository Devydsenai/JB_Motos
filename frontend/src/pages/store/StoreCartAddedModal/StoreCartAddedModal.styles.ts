import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: start center;
  padding: 2.5rem 1rem;
  background: rgba(0, 0, 0, 0.72);
`;

export const Modal = styled.section`
  width: min(560px, 100%);
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
  padding: 1.35rem 1.2rem 1.25rem;
  position: relative;

  h2 {
    margin: 0 2rem 1rem 0;
    text-align: center;
    font-size: 1.35rem;
    font-weight: 500;
  }
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 0.7rem;
  right: 0.8rem;
  border: none;
  background: transparent;
  color: #d60000;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
`;

export const ProductLine = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
  align-items: start;
  margin-bottom: 1rem;

  img {
    width: 150px;
    height: 130px;
    object-fit: contain;
    border: 1px solid
      ${({ theme }) =>
        theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.12)"};
    background: ${({ theme }) => (theme.mode === "light" ? "#fafafa" : "#151515")};
  }

  p {
    margin: 0 0 1rem;
    line-height: 1.45;
  }

  span {
    color: ${({ theme }) => (theme.mode === "light" ? "#555" : "#d4d4d4")};
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const Actions = styled.div`
  display: grid;
  gap: 0.85rem;
  justify-items: center;

  button,
  a {
    min-width: 210px;
    min-height: 42px;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #d60000;
    color: #fff;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 950;
    cursor: pointer;
  }
`;
