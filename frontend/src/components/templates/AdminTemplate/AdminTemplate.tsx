import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { AdminSidebar } from "@components/organisms/AdminSidebar";
import { AdminHeader } from "@components/organisms/AdminHeader";

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
    <Layout>
      <AdminSidebar />
      <Main>
        <AdminHeader />
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Layout>
  );
}
