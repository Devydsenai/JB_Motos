import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AccountPage = styled.div`
  background: #fff;
  color: #111;
  padding: 2rem;
  min-height: 100vh;

  @media (max-width: 700px) {
    padding: 1rem;
  }
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  margin-bottom: 2rem;
  color: #111;

  span:first-child {
    color: #444;
  }
`;

export const Title = styled.h2`
  margin: 0 0 2rem;
  font-size: 1.15rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 950;
`;

export const AccountGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.section`
  border: 1px solid #e5e7eb;
  border-top: 3px solid #111;
  min-height: 255px;
  padding: 1.7rem 1.9rem;
`;

export const NewCustomer = styled(Panel)`
  p {
    margin: 0 0 0.8rem;
    font-size: 0.78rem;
  }

  h3 {
    margin: 0 0 1rem;
    font-size: 1rem;
    font-weight: 500;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1.4rem;
    display: grid;
    gap: 0.45rem;
    font-size: 0.82rem;
  }

  li::before {
    content: "✓";
    margin-right: 0.55rem;
    font-weight: 950;
  }
`;

export const RedBtn = styled.button`
  border: none;
  background: #c41e1e;
  color: #fff;
  min-height: 34px;
  padding: 0 1rem;
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 950;
  cursor: pointer;
`;

export const RegisterPanel = styled.section`
  border: 1px solid #e5e7eb;
  border-top: 3px solid #111;
  min-height: 330px;
  padding: 1.6rem 1.9rem;
  animation: ${slideUp} 0.28s ease both;
`;

export const RegisterSplit = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 1.5rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const MotoPrompt = styled.aside`
  border: 1px solid #e5e7eb;
  padding: 1.25rem;
  background: #fafafa;

  p {
    margin: 0 0 0.65rem;
    font-size: 0.78rem;
    color: #6b7280;
    line-height: 1.45;
  }

  strong {
    display: block;
    margin-bottom: 0.45rem;
    font-size: 0.9rem;
  }
`;

export const RegisterHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.78rem;

  button {
    border: none;
    background: transparent;
    color: #111;
    text-transform: uppercase;
    font-size: 0.7rem;
    font-weight: 800;
    cursor: pointer;
  }
`;
