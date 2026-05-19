import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { NavItem } from "@components/molecules/NavItem";
import { Text } from "@components/atoms/Text";
import { Icon } from "@components/atoms/Icon";
import { adminRoutes } from "@/config/adminMenu";

const Aside = styled.aside<{ $collapsed?: boolean }>`
  width: ${({ theme, $collapsed }) =>
    $collapsed ? "72px" : theme.layout.sidebarWidth};
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.sidebar};
  color: ${({ theme }) => theme.colors.sidebarText};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.2s;
`;

const Brand = styled.div<{ $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  span {
    font-weight: 700;
    font-size: 1.1rem;
    color: #fff;
    ${({ $collapsed }) => $collapsed && "display: none;"}
  }
`;

const Nav = styled.nav`
  flex: 1;
  padding: 1rem 0.5rem;
  overflow-y: auto;

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
`;

const Footer = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const StoreLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.sidebarText};
  border: 1px dashed rgba(255, 255, 255, 0.25);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
`;

export interface AdminSidebarProps {
  collapsed?: boolean;
}

export function AdminSidebar({ collapsed = false }: AdminSidebarProps) {
  return (
    <Aside $collapsed={collapsed}>
      <Brand $collapsed={collapsed}>
        <Icon name="wrench-adjustable" size={28} color="#c41e1e" />
        {!collapsed && <span>JB Motos</span>}
      </Brand>

      <Nav aria-label="Menu administrativo">
        <ul>
          <NavItem
            to={adminRoutes.dashboard}
            icon="speedometer2"
            label="Dashboard"
            collapsed={collapsed}
            end
          />
          <NavItem
            to={adminRoutes.produtos}
            icon="box-seam"
            label="Produtos"
            collapsed={collapsed}
          />
          <NavItem
            to={adminRoutes.estoque}
            icon="archive"
            label="Estoque"
            collapsed={collapsed}
          >
            {!collapsed && (
              <>
                <NavItem
                  to={adminRoutes.estoqueEntrada}
                  icon="box-arrow-in-down"
                  label="Entrada"
                  collapsed={collapsed}
                />
                <NavItem
                  to={adminRoutes.estoqueSaida}
                  icon="box-arrow-up"
                  label="Saída"
                  collapsed={collapsed}
                />
                <NavItem
                  to={adminRoutes.estoqueAdicionar}
                  icon="plus-circle"
                  label="Adicionar produto"
                  collapsed={collapsed}
                />
              </>
            )}
          </NavItem>
          <NavItem
            to={adminRoutes.requisicoes}
            icon="clipboard-check"
            label="Requisições"
            collapsed={collapsed}
          />
          <NavItem
            to={adminRoutes.servicos}
            icon="tools"
            label="Serviços"
            collapsed={collapsed}
          />
          <NavItem
            to={adminRoutes.financeiro}
            icon="currency-dollar"
            label="Financeiro"
            collapsed={collapsed}
          />
          <NavItem
            to={adminRoutes.cadastros}
            icon="folder-plus"
            label="Cadastros"
            collapsed={collapsed}
          >
            {!collapsed && (
              <>
                <NavItem
                  to={adminRoutes.cadastroProdutos}
                  icon="tag"
                  label="Produtos"
                  collapsed={collapsed}
                />
                <NavItem
                  to={adminRoutes.cadastroFornecedores}
                  icon="truck"
                  label="Fornecedores"
                  collapsed={collapsed}
                />
              </>
            )}
          </NavItem>
          <NavItem
            to={adminRoutes.administrativo}
            icon="shield-lock"
            label="Administrativo"
            collapsed={collapsed}
          />
        </ul>
      </Nav>

      <Footer>
        <StoreLink to={adminRoutes.loja} title="Voltar para a loja">
          <Icon name="shop" size={18} color="currentColor" />
          {!collapsed && <span>Voltar para a loja</span>}
        </StoreLink>
        {!collapsed && (
          <Text variant="caption" color="muted" style={{ marginTop: "0.75rem" }}>
            Perfil: Administrativo
          </Text>
        )}
      </Footer>
    </Aside>
  );
}
