import styled from "styled-components";

export const Page = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem 1.25rem;
  background: ${({ theme }) => (theme.mode === "light" ? "#f8fafc" : "#080808")};
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
`;

export const Card = styled.section`
  width: min(520px, 100%);
  padding: 2rem 1.75rem;
  border-radius: 18px;
  text-align: center;
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
  border: 1px solid
    ${({ theme }) =>
      theme.mode === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"};
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
`;

export const IconWrap = styled.div`
  width: 72px;
  height: 72px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(22, 163, 74, 0.15);
  color: #16a34a;
  font-size: 2rem;
`;

export const Title = styled.h1`
  margin: 0 0 0.5rem;
  font-size: 1.45rem;
`;

export const Message = styled.p`
  margin: 0 0 1.5rem;
  line-height: 1.55;
  color: ${({ theme }) => (theme.mode === "light" ? "#555" : "#cfcfcf")};
`;

export const Actions = styled.div`
  display: grid;
  gap: 0.65rem;
`;

export const PrimaryBtn = styled.button`
  border: 0;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  background: #c41e1e;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
`;

export const SecondaryBtn = styled.button`
  border: 1px solid rgba(196, 30, 30, 0.45);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  background: transparent;
  color: ${({ theme }) => (theme.mode === "light" ? "#991b1b" : "#ffb4b4")};
  font-weight: 700;
  cursor: pointer;
`;
