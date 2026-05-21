import { Outlet } from "react-router-dom";
import { AdminAuthGuard } from "@/components/auth/AdminAuthGuard";
import styled from "styled-components";
import { AdminSidebar } from "@components/organisms/AdminSidebar";
import { AdminHeader } from "@components/organisms/AdminHeader";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { SessaoProvider } from "@/contexts/SessaoContext";
import { AtendimentoProvider } from "@/contexts/AtendimentoContext";
import { FornecedoresProvider } from "@/contexts/FornecedoresContext";
import { FuncionariosProvider } from "@/contexts/FuncionariosContext";
import { ProdutosProvider } from "@/contexts/ProdutosContext";

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Content = styled.main`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

export function AdminTemplate() {
  return (
    <SessaoProvider>
    <SidebarProvider>
      <ProdutosProvider>
        <FornecedoresProvider>
        <FuncionariosProvider>
        <AtendimentoProvider>
        <Layout>
          <AdminSidebar />
          <Main>
            <AdminHeader />
            <Content>
              <AdminAuthGuard>
                <Outlet />
              </AdminAuthGuard>
            </Content>
          </Main>
        </Layout>
        </AtendimentoProvider>
        </FuncionariosProvider>
        </FornecedoresProvider>
      </ProdutosProvider>
    </SidebarProvider>
    </SessaoProvider>
  );
}
