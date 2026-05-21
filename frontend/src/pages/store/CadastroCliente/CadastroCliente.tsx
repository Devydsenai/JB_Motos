import type { FormEvent } from "react";
import { CadastroForm } from "./CadastroCliente.styles";

type CadastroClienteProps = {
  onSubmit: () => void;
  onCancel?: () => void;
};

export function CadastroCliente({ onSubmit, onCancel }: CadastroClienteProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <CadastroForm onSubmit={handleSubmit}>
      <label>
        Nome *
        <input type="text" required />
      </label>
      <label>
        Sobrenome *
        <input type="text" required />
      </label>
      <label>
        Endereço de e-mail *
        <input type="email" required />
      </label>
      <label>
        Senha *
        <input type="password" required />
      </label>
      <label>
        Confirmar senha *
        <input type="password" required />
      </label>
      <div>
        <button type="submit">Registrar</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </CadastroForm>
  );
}
