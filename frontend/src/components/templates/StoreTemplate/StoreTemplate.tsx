import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import { Text } from "@components/atoms/Text";
import { Button } from "@components/atoms/Button";
import { adminRoutes } from "@/config/adminMenu";

const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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
        <Link to={adminRoutes.dashboard}>
          <Button variant="outline" size="sm">
            Área administrativa
          </Button>
        </Link>
      </TopBar>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}
