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
  margin-bottom: 1.4rem;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export const MapArea = styled.section`
  position: relative;
  min-height: 360px;
  margin-bottom: 3rem;
  overflow: hidden;
  background: #365f67;

  iframe {
    width: 100%;
    height: 360px;
    border: 0;
    display: block;
    filter: saturate(0.9);
  }
`;

export const MapCard = styled.div`
  position: absolute;
  left: 1.2rem;
  top: 5.2rem;
  width: min(330px, calc(100% - 2.4rem));
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
  padding: 1.3rem;
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.12);

  h2 {
    margin: 0 0 0.8rem;
    font-size: 0.95rem;
  }

  p {
    margin: 0 0 0.8rem;
    font-size: 0.84rem;
    line-height: 1.55;
  }

  a {
    display: inline-flex;
    min-height: 34px;
    align-items: center;
    padding: 0 0.9rem;
    background: #d60000;
    color: #fff;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 0.72rem;
    font-weight: 950;
  }
`;

export const ContactGrid = styled.section`
  display: grid;
  grid-template-columns: 1.1fr minmax(280px, 0.9fr) 1fr;
  gap: clamp(2rem, 5vw, 4rem);

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const ColumnTitle = styled.h1`
  margin: 0 0 1.6rem;
  font-size: 1.05rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 950;
`;

export const ContactList = styled.div`
  display: grid;
  gap: 1.35rem;
`;

export const ContactItem = styled.article`
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: 1rem;
  padding-bottom: 1.35rem;
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)"};

  i {
    color: #c41e1e;
    font-size: 2rem;
  }

  h2 {
    margin: 0 0 0.35rem;
    font-size: 0.82rem;
    text-transform: uppercase;
    font-weight: 950;
  }

  p,
  a {
    margin: 0;
    color: ${({ theme }) => (theme.mode === "light" ? "#333" : "#d8d8d8")};
    text-decoration: none;
    font-size: 0.84rem;
    line-height: 1.5;
  }
`;

export const ContactForm = styled.form`
  display: grid;
  gap: 0.9rem;

  input,
  textarea {
    width: 100%;
    border: 1.5px solid
      ${({ theme }) =>
        theme.mode === "light" ? "rgba(0, 0, 0, 0.28)" : "rgba(255, 255, 255, 0.34)"};
    background: ${({ theme }) => (theme.mode === "light" ? "#fbfbfb" : "#121212")};
    color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
    padding: 0.9rem 1rem;
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
    min-height: 138px;
    resize: vertical;
  }

  button {
    justify-self: start;
    border: none;
    background: #d60000;
    color: #fff;
    min-height: 42px;
    padding: 0 1.35rem;
    text-transform: uppercase;
    font-weight: 950;
    cursor: pointer;
  }
`;

export const SocialList = styled.div`
  display: grid;
  gap: 0.4rem;
`;

export const SocialLink = styled.a`
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 1rem;
  align-items: center;
  min-height: 58px;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)"};
  font-size: 0.78rem;
  text-transform: uppercase;
  font-weight: 950;

  i {
    color: #c41e1e;
    font-size: 1.5rem;
  }
`;
