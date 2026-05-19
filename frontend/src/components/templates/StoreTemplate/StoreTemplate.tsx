import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Text } from "@components/atoms/Text";
import { AccountAvatar } from "@components/molecules/AccountAvatar";
import { ThemeToggle } from "@components/molecules/ThemeToggle";
import { adminRoutes } from "@/config/adminMenu";

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
  return (
    <Layout>
      <TopBar>
        <Text as="h1" variant="h2" weight="bold" color="primary">
          JB Motos — Loja
        </Text>
        <Actions>
          <ThemeToggle />
          <AccountAvatar
            label="Minha conta"
            to={adminRoutes.dashboard}
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
