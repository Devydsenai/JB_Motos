import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Layout = styled.div`
  min-height: 100vh;
  background: #050505;
`;

export function StoreTemplate() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
