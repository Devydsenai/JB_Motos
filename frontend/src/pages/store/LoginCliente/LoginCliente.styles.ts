import styled from "styled-components";

export const LoginHint = styled.p`
  margin: 0;
  padding: 0.65rem 0.75rem;
  font-size: 0.78rem;
  line-height: 1.45;
  color: ${({ theme }) => (theme.mode === "light" ? "#374151" : "#e5e5e5")};
  background: rgba(196, 30, 30, 0.08);
  border-left: 3px solid #c41e1e;
`;

export const LoginError = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #b91c1c;
  font-weight: 600;
`;

export const LoginForm = styled.form`
  display: grid;
  gap: 0.85rem;

  > span {
    font-size: 0.78rem;
    color: ${({ theme }) => (theme.mode === "light" ? "#222" : "#d4d4d4")};
  }

  label {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.45rem;
    color: ${({ theme }) => (theme.mode === "light" ? "#6b7280" : "#a3a3a3")};
    font-size: 0.78rem;
    font-weight: 500;
  }

  input {
    border: 1.5px solid
      ${({ theme }) =>
        theme.mode === "light" ? "rgba(0, 0, 0, 0.28)" : "rgba(255, 255, 255, 0.34)"};
    background: ${({ theme }) => (theme.mode === "light" ? "#fbfbfb" : "#121212")};
    color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
    border-radius: 0;
    padding: 0.72rem 0.8rem;
    font-size: 0.9rem;

    &:focus {
      border-color: #c41e1e;
      box-shadow: 0 0 0 3px rgba(196, 30, 30, 0.16);
      outline: none;
      background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#171717")};
    }
  }

  div {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.25rem;
    flex-wrap: wrap;
  }

  button {
    border: none;
    background: #c41e1e;
    color: #fff;
    min-height: 34px;
    padding: 0 1rem;
    font-weight: 950;
    text-transform: uppercase;
    font-size: 0.75rem;
    cursor: pointer;

    &:disabled {
      opacity: 0.65;
      cursor: wait;
    }
  }

  a {
    color: ${({ theme }) => (theme.mode === "light" ? "#222" : "#d4d4d4")};
    text-decoration: none;
    font-size: 0.78rem;

    &:hover {
      color: #c41e1e;
    }
  }
`;
