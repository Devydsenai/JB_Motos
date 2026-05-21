import { useState, type FormEvent } from "react";
import { LoginForm, LoginHint, LoginError } from "./LoginCliente.styles";

export type LoginCredentials = {
  email: string;
  senha: string;
};

type LoginClienteProps = {
  onSubmit: (credentials: LoginCredentials) => void | Promise<void>;
  loading?: boolean;
  error?: string;
};

export function LoginCliente({ onSubmit, loading, error }: LoginClienteProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({ email, senha });
  };

  return (
    <LoginForm onSubmit={handleSubmit}>
      <LoginHint>
        Clientes, funcionários e proprietário entram aqui com o mesmo e-mail e senha.
      </LoginHint>
      <span>Já registrado?</span>
      <label>
        Endereço de e-mail *
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </label>
      <label>
        Senha *
        <input
          type="password"
          required
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={loading}
        />
      </label>
      {error && <LoginError>{error}</LoginError>}
      <div>
        <button type="submit" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
        <a href="#recuperar-senha">Esqueceu sua senha?</a>
      </div>
    </LoginForm>
  );
}
