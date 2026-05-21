import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#080808")};
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
`;

export const Top = styled.header`
  max-width: 1060px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)"};

  a {
    color: inherit;
    text-decoration: none;
    font-size: 1.1rem;
  }

  a:last-child {
    color: #c41e1e;
    display: inline-flex;
    align-items: center;
  }
`;

export const Layout = styled.div`
  max-width: 1060px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 430px;
  min-height: calc(100vh - 57px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const FormArea = styled.form`
  padding: 2rem 2rem 2rem 1.5rem;
  display: grid;
  gap: 1.85rem;

  h2 {
    margin: 0 0 0.65rem;
    font-size: 1.2rem;
    font-weight: 500;
  }

  p {
    margin: 0;
    color: ${({ theme }) => (theme.mode === "light" ? "#666" : "#cfcfcf")};
    font-size: 0.85rem;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.65rem;

  h2 {
    margin: 0;
  }

  a {
    color: #c41e1e;
    font-size: 0.86rem;
    text-decoration: underline;
  }
`;

export const FieldStack = styled.div`
  display: grid;
  gap: 1rem;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Input = styled.input`
  width: 100%;
  min-height: 48px;
  border: 1.5px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.28)" : "rgba(255, 255, 255, 0.34)"};
  border-radius: 6px;
  background: ${({ theme }) => (theme.mode === "light" ? "#fbfbfb" : "#121212")};
  color: inherit;
  padding: 0 0.75rem;

  &::placeholder {
    color: ${({ theme }) => (theme.mode === "light" ? "#5d6673" : "#b8bec8")};
    opacity: 1;
  }

  &:focus {
    border-color: #c41e1e;
    box-shadow: 0 0 0 3px rgba(196, 30, 30, 0.16);
    outline: none;
    background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#171717")};
  }
`;

export const Select = styled.select`
  width: 100%;
  min-height: 48px;
  border: 1.5px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.28)" : "rgba(255, 255, 255, 0.34)"};
  border-radius: 6px;
  background: ${({ theme }) => (theme.mode === "light" ? "#fbfbfb" : "#121212")};
  color: inherit;
  padding: 0 0.75rem;

  &:focus {
    border-color: #c41e1e;
    box-shadow: 0 0 0 3px rgba(196, 30, 30, 0.16);
    outline: none;
  }
`;

export const CheckLine = styled.label`
  display: flex;
  gap: 0.55rem;
  align-items: center;
  font-size: 0.85rem;
`;

export const DisabledBox = styled.div`
  min-height: 58px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: ${({ theme }) => (theme.mode === "light" ? "#f4f4f4" : "#151515")};
  color: ${({ theme }) => (theme.mode === "light" ? "#777" : "#cfcfcf")};
  font-size: 0.85rem;
`;

export const PaymentBox = styled.section`
  border: 1px solid #c41e1e;
  border-radius: 6px;
  overflow: hidden;
  background: ${({ theme }) => (theme.mode === "light" ? "#f7f7f7" : "#111")};
`;

export const PaymentHead = styled.div`
  min-height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.8rem;
  background: rgba(196, 30, 30, 0.12);
`;

export const PaymentBody = styled.div`
  padding: 1rem;
  display: grid;
  gap: 1rem;

  ${FieldGrid} {
    gap: 1rem;
  }
`;

export const MercadoPagoOnly = styled.div`
  padding: 1.2rem;
  display: grid;
  gap: 0.65rem;
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#151515")};

  strong {
    color: #c41e1e;
    font-size: 1rem;
  }

  p {
    margin: 0;
    line-height: 1.5;
  }

  span {
    font-weight: 850;
  }
`;

export const TestModeNotice = styled.div`
  margin-top: 0.75rem;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  border: 1px dashed rgba(196, 30, 30, 0.45);
  background: rgba(196, 30, 30, 0.08);
  font-size: 0.82rem;
  line-height: 1.5;
  color: ${({ theme }) => (theme.mode === "light" ? "#7f1d1d" : "#fecaca")};

  strong {
    display: block;
    margin-bottom: 0.35rem;
    color: #c41e1e;
  }

  ul {
    margin: 0.35rem 0 0;
    padding-left: 1.1rem;
  }
`;

export const PixBox = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
  align-items: center;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const PixQr = styled.div`
  width: 150px;
  height: 150px;
  padding: 0.55rem;
  background:
    linear-gradient(90deg, #111 10px, transparent 10px) 0 0 / 20px 20px,
    linear-gradient(#111 10px, transparent 10px) 0 0 / 20px 20px,
    #fff;
  border: 8px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.14);
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 36px;
    height: 36px;
    border: 8px solid #111;
    background: #fff;
  }

  &::before {
    top: 10px;
    left: 10px;
  }

  &::after {
    right: 10px;
    bottom: 10px;
  }
`;

export const PayNow = styled.button`
  min-height: 52px;
  border: none;
  border-radius: 6px;
  background: #c41e1e;
  color: #fff;
  font-weight: 850;
  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const Summary = styled.aside`
  border-left: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.12)"};
  background: ${({ theme }) => (theme.mode === "light" ? "#fafafa" : "#101010")};
  padding: 2rem;

  @media (min-width: 901px) {
    position: sticky;
    top: 0;
    align-self: start;
    min-height: 100vh;
  }
`;

export const SummaryItem = styled.article`
  display: grid;
  grid-template-columns: 76px 1fr auto;
  gap: 0.8rem;
  align-items: start;
  margin-bottom: 1.35rem;

  img {
    width: 76px;
    height: 76px;
    object-fit: contain;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }

  h3 {
    margin: 0;
    font-size: 0.86rem;
    font-weight: 500;
  }
`;

export const TotalLine = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 0.85rem 0;
  font-size: 0.92rem;

  strong {
    font-size: 1.25rem;
  }
`;
