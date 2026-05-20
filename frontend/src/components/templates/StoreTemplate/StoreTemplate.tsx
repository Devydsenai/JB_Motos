import { Outlet, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Text } from "@components/atoms/Text";
import { AccountAvatar } from "@components/molecules/AccountAvatar";
import { ThemeToggle } from "@components/molecules/ThemeToggle";

const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const BrandArea = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavMenu = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const NavLink = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ $active, theme }) => ($active ? "#C41E1E" : theme.colors.textMuted || "#666")};
  cursor: pointer;
  padding: 0.25rem 0;
  border-bottom: 2px solid ${({ $active }) => ($active ? "#C41E1E" : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    color: #C41E1E;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Content = styled.main`
  flex: 1;
  padding: 2rem 1.5rem;
`;

export function StoreTemplate() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout>
      <TopBar>
        <BrandArea>
          <Text as="h1" variant="h2" weight="bold" color="primary" style={{ cursor: "pointer" }} onClick={() => navigate("/loja")}>
            JBM
          </Text>
          
          <NavMenu>
            <NavLink $active={location.pathname === "/loja"} onClick={() => navigate("/loja")}>
              Início
            </NavLink>
            <NavLink $active={location.pathname === "/loja/pedido"} onClick={() => navigate("/loja/pedido")}>
              Fazer Pedido
            </NavLink>
          </NavMenu>
        </BrandArea>

        <Actions>
          <ThemeToggle />
          <AccountAvatar
            label="Minha conta"
            to="/loja/minha-conta"
            title="Ir para área administrativa"
          />
        </Actions>
      </TopBar>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}