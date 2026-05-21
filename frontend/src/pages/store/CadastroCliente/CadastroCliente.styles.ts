import styled from "styled-components";

export const CadastroForm = styled.form`
  display: grid;
  grid-template-columns: 190px minmax(220px, 360px);
  align-items: center;
  justify-content: center;
  column-gap: 1rem;
  row-gap: 0.85rem;

  label {
    display: contents;
    font-size: 0.78rem;
    color: #6b7280;
    text-align: right;
  }

  input {
    border: 1.5px solid rgba(0, 0, 0, 0.28);
    background: #fbfbfb;
    color: #111;
    border-radius: 0;
    padding: 0.72rem 0.8rem;
    font-size: 0.9rem;

    &:focus {
      border-color: #c41e1e;
      box-shadow: 0 0 0 3px rgba(196, 30, 30, 0.16);
      outline: none;
      background: #fff;
    }
  }

  div {
    grid-column: 2;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    margin-top: 0.2rem;
  }

  button:first-child {
    border: none;
    background: #c41e1e;
    color: #fff;
    min-height: 36px;
    padding: 0 1rem;
    font-weight: 950;
    text-transform: uppercase;
    font-size: 0.75rem;
    cursor: pointer;
  }

  button:last-child {
    border: none;
    background: transparent;
    color: #222;
    cursor: pointer;
    font-size: 0.78rem;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;

    label {
      display: grid;
      gap: 0.4rem;
      text-align: left;
    }

    div {
      grid-column: 1;
    }
  }
`;
