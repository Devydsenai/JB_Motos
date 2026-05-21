import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { AtendimentoProvider } from "@/contexts/AtendimentoContext";
import { AssistenteClienteWidget } from "@/pages/store/AssistenteClienteWidget";

const Layout = styled.div`
  min-height: 100vh;
  background: #050505;
`;

export function StoreTemplate() {
  return (
    <Layout>
      <AtendimentoProvider>
        <Outlet />
        <AssistenteClienteWidget />
      </AtendimentoProvider>
    </Layout>
  );
}
