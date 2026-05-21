import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideShow = keyframes`
  0%, 28% { opacity: 1; transform: scale(1); }
  33%, 95% { opacity: 0; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
`;

export const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => (theme.mode === "light" ? "#f5f5f5" : "#050505")};
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
  font-family: "Inter", "Segoe UI", Arial, sans-serif;
`;

export const TopPanel = styled.div`
  background: #c41e1e;
  color: #fff;
  font-size: 0.675rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 900;
`;

export const Container = styled.div`
  width: min(1170px, calc(100% - 2rem));
  margin: 0 auto;
`;

export const TopPanelInner = styled(Container)`
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.5rem 0;
  }
`;

export const TopActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 1.15rem;

  button,
  a {
    color: #fff;
    border: none;
    background: transparent;
    padding: 0;
    font: inherit;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    gap: 0.35rem;
    align-items: center;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 900;
  }
`;

export const TopSearchForm = styled.form`
  display: inline-flex;
  align-items: center;
  position: relative;
  height: 36px;

  button {
    height: 36px;
    color: #fff;
  }

  input {
    width: 0;
    opacity: 0;
    pointer-events: none;
    border: none;
    background: #fff;
    color: #111;
    padding: 0;
    height: 36px;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: none;
    outline: none;
    transition: width 0.25s ease, opacity 0.2s ease, padding 0.2s ease;

    &::placeholder {
      color: #6b7280;
      opacity: 1;
    }
  }

  &[data-open="true"] {
    gap: 0;
    width: min(334px, calc(42vw + 34px));

    button:first-child {
      position: absolute;
      top: 0;
      right: 34px;
      width: 34px;
      z-index: 2;
      justify-content: center;
      background: #fff;
      color: #111;
    }

    input {
      width: calc(100% - 34px);
      opacity: 1;
      pointer-events: auto;
      padding: 0 2.45rem 0 0.75rem;
    }
  }
`;

export const SearchSubmitBtn = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 900;
  cursor: pointer;
  transition: background 0.2s ease;
`;

export const SearchCloseBtn = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  width: 34px;
  height: 36px;
  border: none;
  background: #d60000;
  color: #fff;
  font-size: 1rem;
  font-weight: 900;
  cursor: pointer;
`;

export const TopThemeWrap = styled.div`
  button {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }

  i {
    color: #fff;
    font-size: 13px;
  }
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${({ theme }) =>
    theme.mode === "light" ? "rgba(255, 255, 255, 0.96)" : "rgba(5, 5, 5, 0.92)"};
  backdrop-filter: blur(14px);
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"};
`;

export const HeaderInner = styled(Container)`
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (max-width: 860px) {
    min-height: auto;
    padding: 1rem 0;
    flex-wrap: wrap;
  }
`;

export const LogoLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
  text-decoration: none;

  img {
    width: 92px;
    height: auto;
    display: block;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1.25rem, 4vw, 3.25rem);
  flex: 1;

  a {
    color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
    text-decoration: none;
    text-transform: uppercase;
    font-size: 0.62rem;
    letter-spacing: 0.11em;
    font-weight: 950;
    transition: color 0.2s ease;
  }

  > a:hover,
  > a[aria-current="page"],
  > div > a[aria-current="page"],
  > div:hover:not([data-closing="true"]) > a {
    color: #ff2a2a;
  }

  @media (max-width: 760px) {
    order: 3;
    width: 100%;
    overflow-x: auto;
    gap: 1rem;
    padding-bottom: 0.25rem;
  }
`;

export const MegaMenuPanel = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  width: 100vw;
  transform: translateX(-50%) translateY(10px);
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#0b0b0b")};
  border-top: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"};
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"};
  box-shadow: 0 22px 45px rgba(0, 0, 0, 0.12);
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition: none;
  z-index: 30;
`;

export const MegaMenuGrid = styled.div`
  max-width: 1220px;
  margin: 0 auto;
  padding: 2rem 1.5rem 1.7rem;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2rem;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const MegaMenuColumn = styled.div`
  img {
    width: 100%;
    aspect-ratio: 1.45 / 1;
    object-fit: cover;
    display: block;
    margin-bottom: 0.9rem;
  }

  a {
    display: block;
    margin: 0 0 0.7rem;
    color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
    font-size: 0.67rem;
    line-height: 1.1;
    letter-spacing: 0.08em;
    text-transform: none;
    font-weight: 950;
  }

  a:hover {
    color: #ff2a2a;
  }
`;

export const NavCatalogItem = styled.div`
  min-height: 64px;
  display: inline-flex;
  align-items: center;

  > a {
    display: inline-flex;
    align-items: center;
    min-height: 64px;
  }

  &:hover:not([data-closing="true"]) ${MegaMenuPanel} {
    opacity: 1;
    pointer-events: auto;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }

  @media (max-width: 760px) {
    position: static;
    min-height: auto;

    > a {
      min-height: auto;
    }

    ${MegaMenuPanel} {
      display: none;
    }
  }
`;

export const HeaderTools = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const HeaderCart = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.72rem;
  font-weight: 950;
  cursor: pointer;

  &:hover {
    color: #c41e1e;
  }
`;

export const ToolBtn = styled.button`
  border: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.15)"};
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
  border-radius: 999px;
  padding: 0.55rem 0.8rem;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #c41e1e;
  }
`;

export const Hero = styled.section`
  position: relative;
  min-height: 610px;
  overflow: hidden;
  display: grid;
  place-items: center;
  isolation: isolate;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 50% 40%, rgba(196, 30, 30, 0.2), transparent 30%),
      linear-gradient(90deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.9));
    z-index: -1;
  }

  @media (max-width: 760px) {
    min-height: 520px;
  }
`;

export const HeroSlide = styled.div<{ $image: string; $delay: string }>`
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image: url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  opacity: 0;
  animation: ${slideShow} 15s infinite;
  animation-delay: ${({ $delay }) => $delay};
`;

export const HeroContent = styled(Container)`
  text-align: center;
  animation: ${fadeInUp} 0.8s ease both;

  h1 {
    margin: 0;
    font-size: clamp(3rem, 9vw, 6.75rem);
    line-height: 0.92;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-weight: 950;
    text-shadow: 0 18px 50px rgba(0, 0, 0, 0.55);
  }

  p {
    margin: 1rem 0 1.75rem;
    font-size: clamp(1.1rem, 3vw, 1.7rem);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: #f5f5f5;
  }
`;

export const Button = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0 1.5rem;
  border-radius: 0;
  background: #c41e1e;
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 900;
  font-size: 0.78rem;
  border: 2px solid #c41e1e;
  transition: all 0.2s ease;

  &:hover {
    background: #fff;
    color: #111;
    border-color: #fff;
    transform: translateY(-2px);
  }
`;

export const Section = styled.section`
  padding: 4rem 0;
`;

export const SectionHeading = styled.h2`
  text-align: center;
  margin: 0 0 2rem;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 950;
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};

  &::after {
    content: "";
    display: block;
    width: 64px;
    height: 4px;
    margin: 0.8rem auto 0;
    background: #c41e1e;
  }
`;

export const BannerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const BannerCard = styled.article<{ $image: string; $align?: "left" | "center" }>`
  position: relative;
  min-height: 320px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) => ($align === "left" ? "flex-start" : "center")};
  padding: 2rem;
  background-image:
    linear-gradient(90deg, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.16)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;

  &::before {
    content: "";
    position: absolute;
    inset: 16px;
    border: 1px solid rgba(255, 255, 255, 0.35);
    transform: scale(0.96);
    opacity: 0;
    transition: all 0.25s ease;
  }

  &:hover::before {
    opacity: 1;
    transform: scale(1);
  }

  h3 {
    margin: 0 0 1rem;
    font-size: clamp(1.6rem, 4vw, 3rem);
    text-transform: uppercase;
    font-weight: 950;
    position: relative;
  }

  h4 {
    margin: 0 0 0.35rem;
    color: #ff2a2a;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  div {
    position: relative;
    text-align: ${({ $align }) => $align ?? "center"};
  }
`;

export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const GalleryCard = styled.a<{ $image: string }>`
  min-height: 240px;
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  text-decoration: none;
  color: #fff;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.72)), url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;

  h3 {
    margin: 0;
    text-align: center;
    text-transform: uppercase;
    font-size: 1.45rem;
    font-weight: 950;
    transition: transform 0.25s ease;
  }

  &:hover h3 {
    transform: scale(1.08);
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const ProductCard = styled.article`
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
  border: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"};
  overflow: hidden;
  transition: transform 0.25s ease, border-color 0.25s ease;
  animation: ${fadeInUp} 0.6s ease both;

  &:hover {
    transform: translateY(-8px);
    border-color: rgba(196, 30, 30, 0.65);
  }
`;

export const ProductImage = styled.div`
  position: relative;
  height: 245px;
  background: #fff;
  display: grid;
  place-items: center;
  overflow: hidden;

  img {
    max-width: 92%;
    max-height: 92%;
    object-fit: contain;
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  img + img {
    position: absolute;
    opacity: 0;
  }

  ${ProductCard}:hover & img:first-child {
    opacity: 0;
    transform: scale(1.06);
  }

  ${ProductCard}:hover & img + img {
    opacity: 1;
    transform: scale(1.06);
  }
`;

export const Badge = styled.span<{ $sale?: boolean }>`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.55rem;
  background: ${({ $sale }) => ($sale ? "#111" : "#c41e1e")};
  color: #fff;
  font-size: 0.65rem;
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 0.06em;
`;

export const ProductInfo = styled.div`
  padding: 1rem;

  h3 {
    min-height: 44px;
    margin: 0;
    color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
    font-size: 0.95rem;
    line-height: 1.35;
  }

  p {
    color: ${({ theme }) => (theme.mode === "light" ? "#666" : "#aaa")};
    font-size: 0.78rem;
    line-height: 1.5;
    min-height: 55px;
  }
`;

export const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.8rem 0;
  color: #ff2a2a;
  font-size: 1.15rem;
  font-weight: 950;

  s {
    color: #777;
    font-size: 0.9rem;
  }
`;

export const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;

  button {
    flex: 1;
    border: none;
    background: #c41e1e;
    color: #fff;
    min-height: 38px;
    font-weight: 900;
    text-transform: uppercase;
    font-size: 0.68rem;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  button:last-child {
    flex: 0 0 42px;
    background: #222;
  }

  button:hover {
    background: #fff;
    color: #111;
  }
`;

export const OverlaySale = styled.section<{ $image: string }>`
  min-height: 430px;
  display: grid;
  place-items: center;
  text-align: center;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.52), rgba(0, 0, 0, 0.72)),
    url(${({ $image }) => $image});
  background-size: cover;
  background-position: center;
  background-attachment: fixed;

  div {
    animation: ${pulse} 3s ease-in-out infinite;
  }

  h5 {
    margin: 0 0 0.5rem;
    color: #ff2a2a;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.9rem;
  }

  h2 {
    margin: 0;
    font-size: clamp(2.4rem, 8vw, 5rem);
    font-weight: 950;
  }

  h4 {
    margin: 0.75rem 0 1.5rem;
    font-size: 1.25rem;
  }
`;

export const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const BlogCard = styled.article`
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
  border: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"};
  padding: 1.25rem;

  span {
    color: #ff2a2a;
    font-size: 0.72rem;
    font-weight: 900;
    text-transform: uppercase;
  }

  h3 {
    margin: 0.55rem 0;
    font-size: 1.05rem;
  }

  p {
    color: ${({ theme }) => (theme.mode === "light" ? "#666" : "#aaa")};
    font-size: 0.82rem;
    line-height: 1.55;
  }
`;

export const Footer = styled.footer`
  background: ${({ theme }) => (theme.mode === "light" ? "#f6f6f6" : "#050505")};
  color: ${({ theme }) => (theme.mode === "light" ? "#161616" : "#f4f4f4")};
  border-top: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"};
`;

export const FooterNewsletter = styled.section`
  background: ${({ theme }) => (theme.mode === "light" ? "#f6f6f6" : "#000")};
  padding: 3.4rem 1rem 3.1rem;
  text-align: center;
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)"};

  h2 {
    margin: 0 0 1rem;
    font-size: 1rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 950;
  }

  p {
    margin: 0 auto 2rem;
    max-width: 720px;
    color: ${({ theme }) => (theme.mode === "light" ? "#555" : "#d5d5d5")};
    font-size: 0.86rem;
    line-height: 1.6;
  }

  form {
    width: min(720px, 100%);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 130px;
    border: 1px solid
      ${({ theme }) =>
        theme.mode === "light" ? "rgba(0, 0, 0, 0.28)" : "rgba(255, 255, 255, 0.9)"};
  }

  input {
    border: none;
    background: transparent;
    color: inherit;
    padding: 0 1.2rem;
    min-height: 44px;
    outline: none;
  }

  button {
    border: none;
    background: #d60000;
    color: #fff;
    font-size: 0.72rem;
    font-weight: 950;
    text-transform: uppercase;
    cursor: pointer;
  }

  @media (max-width: 560px) {
    form {
      grid-template-columns: 1fr;
    }

    button {
      min-height: 42px;
    }
  }
`;

export const FooterColumns = styled(Container)`
  padding: 3rem 1rem 2.6rem;
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: clamp(1.8rem, 5vw, 4rem);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const FooterColumn = styled.div`
  h3 {
    margin: 0 0 1.2rem;
    font-size: 0.8rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 950;
  }

  p {
    margin: 0;
    color: ${({ theme }) => (theme.mode === "light" ? "#333" : "#cfcfcf")};
    font-size: 0.84rem;
    line-height: 1.65;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.62rem;
  }

  a {
    color: ${({ theme }) => (theme.mode === "light" ? "#333" : "#cfcfcf")};
    text-decoration: none;
    font-size: 0.82rem;
  }

  a:hover {
    color: #d60000;
  }
`;

export const ScrollTopButton = styled.button`
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 999px;
  background: #e36b6b;
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
  z-index: 25;
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.72);
  display: grid;
  place-items: start center;
  padding: 2.25rem 1rem;
  overflow-y: auto;
`;

export const AccountModal = styled.section`
  width: min(1120px, 100%);
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
  border: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)"};
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
  animation: ${fadeInUp} 0.25s ease both;
`;

export const ModalHeader = styled.header`
  padding: 1rem 1.25rem;
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.08)"};
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 1.1rem;
    text-transform: uppercase;
  }

  button {
    border: none;
    background: transparent;
    color: inherit;
    font-size: 1.35rem;
    cursor: pointer;
  }
`;

export const Tabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  button {
    border: none;
    padding: 0.9rem;
    background: ${({ theme }) => (theme.mode === "light" ? "#f2f2f2" : "#171717")};
    color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
    font-weight: 900;
    cursor: pointer;
  }

  button[aria-selected="true"] {
    background: #c41e1e;
  }
`;

export const Toast = styled.div`
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 60;
  background: #c41e1e;
  color: #fff;
  padding: 0.85rem 1rem;
  font-weight: 800;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
`;
