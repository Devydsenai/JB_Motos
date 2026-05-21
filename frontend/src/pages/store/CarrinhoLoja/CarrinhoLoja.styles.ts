import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  justify-content: flex-end;
`;

export const Drawer = styled.aside`
  width: min(420px, 100%);
  min-height: 100%;
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
  border-left: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)"};
  box-shadow: -24px 0 70px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.08)"};
  display: flex;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
    font-size: 1.1rem;
    text-transform: uppercase;
  }

  button {
    border: none;
    background: transparent;
    color: inherit;
    font-size: 1.4rem;
    cursor: pointer;
  }
`;

export const Content = styled.div`
  flex: 1;
  overflow: auto;
  padding: 1rem 1.25rem;
`;

export const Empty = styled.p`
  color: ${({ theme }) => (theme.mode === "light" ? "#666" : "#aaa")};
  line-height: 1.5;
`;

export const Item = styled.article`
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.85rem 0;
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"};

  img {
    width: 72px;
    height: 72px;
    object-fit: contain;
    background: #fff;
  }

  h3 {
    margin: 0 0 0.35rem;
    font-size: 0.88rem;
  }

  span {
    color: #c41e1e;
    font-weight: 900;
  }

  button {
    border: none;
    background: transparent;
    color: #c41e1e;
    font-weight: 900;
    cursor: pointer;
  }
`;

export const Footer = styled.footer`
  padding: 1rem 1.25rem;
  border-top: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.08)"};

  button {
    width: 100%;
    min-height: 44px;
    border: none;
    background: #c41e1e;
    color: #fff;
    font-weight: 950;
    text-transform: uppercase;
    cursor: pointer;
  }
`;
