import { useState } from "react";
import { Link } from "react-router-dom";
import { readStoreAuth } from "@/services/authStorage";
import { CadastroCliente } from "../CadastroCliente";
import { LoginCliente, type LoginCredentials } from "../LoginCliente";
import { MotoCliente } from "../MotoCliente";
import {
  AccountGrid,
  AccountPage,
  Breadcrumb,
  LoggedInActions,
  LoggedInPanel,
  MotoPrompt,
  NewCustomer,
  OutlineBtn,
  Panel,
  RedBtn,
  RegisterHead,
  RegisterPanel,
  RegisterSplit,
  Title,
} from "./ContaCliente.styles";

type ContaClienteProps = {
  onLogin: (credentials: LoginCredentials) => void | Promise<void>;
  onLogout: () => void;
  onCadastro: () => void;
  onCadastroMoto: () => void;
  loginLoading?: boolean;
  loginError?: string;
};

export function ContaCliente({
  onLogin,
  onLogout,
  onCadastro,
  onCadastroMoto,
  loginLoading,
  loginError,
}: ContaClienteProps) {
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [motoAberta, setMotoAberta] = useState(false);
  const storeAuth = readStoreAuth();

  if (storeAuth && !cadastroAberto) {
    return (
      <AccountPage>
        <Breadcrumb>
          <span>Início</span>
          <span>›</span>
          <strong>Conta</strong>
        </Breadcrumb>

        <Title>Minha conta</Title>

        <LoggedInPanel>
          <h3>Olá, {storeAuth.customer.nome}</h3>
          <p>Você está conectado como {storeAuth.customer.email}.</p>
          <LoggedInActions>
            <RedBtn as={Link} to="/loja">
              Ir para o início
            </RedBtn>
            <OutlineBtn as={Link} to="/loja/favoritos">
              Favoritos
            </OutlineBtn>
            <OutlineBtn type="button" onClick={onLogout}>
              Sair da conta
            </OutlineBtn>
          </LoggedInActions>
        </LoggedInPanel>
      </AccountPage>
    );
  }

  return (
    <AccountPage>
      <Breadcrumb>
        <span>Início</span>
        <span>›</span>
        <strong>Conta</strong>
      </Breadcrumb>

      <Title>Conta</Title>

      {cadastroAberto && motoAberta ? (
        <RegisterPanel>
          <RegisterHead>
            <span>Cadastrar moto</span>
            <button type="button" onClick={() => setMotoAberta(false)}>
              × Fechar
            </button>
          </RegisterHead>
          <MotoCliente
            onSubmit={() => {
              onCadastroMoto();
              setMotoAberta(false);
            }}
            onCancel={() => setMotoAberta(false)}
          />
        </RegisterPanel>
      ) : cadastroAberto ? (
        <RegisterPanel>
          <RegisterHead>
            <span>Criar uma conta</span>
            <button type="button" onClick={() => setCadastroAberto(false)}>
              × Fechar
            </button>
          </RegisterHead>
          <RegisterSplit>
            <CadastroCliente
              onSubmit={onCadastro}
              onCancel={() => setCadastroAberto(false)}
            />
            <MotoPrompt>
              <strong>Cadastrar moto</strong>
              <p>
                Você pode registrar modelo, placa e ID da moto para a oficina
                identificar o veículo no administrativo.
              </p>
              <p>Se preferir, pode fazer isso depois.</p>
              <RedBtn type="button" onClick={() => setMotoAberta(true)}>
                Cadastrar moto
              </RedBtn>
            </MotoPrompt>
          </RegisterSplit>
        </RegisterPanel>
      ) : (
        <AccountGrid>
          <NewCustomer>
            <p>Novo por aqui?</p>
            <h3>O cadastro é gratuito e fácil!</h3>
            <ul>
              <li>Compra mais rápida</li>
              <li>Salve vários endereços de entrega</li>
              <li>Cadastre sua moto para agilizar o atendimento</li>
              <li>Veja e acompanhe pedidos e serviços</li>
            </ul>
            <RedBtn type="button" onClick={() => setCadastroAberto(true)}>
              Criar uma conta
            </RedBtn>
          </NewCustomer>

          <Panel>
            <LoginCliente
              onSubmit={onLogin}
              loading={loginLoading}
              error={loginError}
            />
          </Panel>
        </AccountGrid>
      )}
    </AccountPage>
  );
}
