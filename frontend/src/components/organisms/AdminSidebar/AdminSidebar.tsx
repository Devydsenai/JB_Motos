import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { NavItem } from "@components/molecules/NavItem";
import { NavItemGroup } from "@components/molecules/NavItemGroup";
import { Text } from "@components/atoms/Text";
import { Icon } from "@components/atoms/Icon";
import { adminRoutes } from "@/config/adminMenu";
import { useSidebar } from "@/contexts/SidebarContext";
import { useSessao } from "@/contexts/SessaoContext";
import { perfilSistemaLabels } from "@/config/permissoes";

const Aside = styled.aside<{ $collapsed?: boolean }>`
  width: ${({ theme, $collapsed }) =>
    $collapsed ? "72px" : theme.layout.sidebarWidth};
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.sidebar};
  color: ${({ theme }) => theme.colors.sidebarText};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.25s ease;
  overflow: visible;
`;

const BrandButton = styled.button<{ $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1.25rem 1rem;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  ${({ $collapsed }) =>
    $collapsed &&
    `
    justify-content: center;
    padding: 1.25rem 0.5rem;
  `}
`;

const BrandText = styled.span<{ $collapsed?: boolean }>`
  flex: 1;
  font-weight: 700;
  font-size: 1.1rem;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  width: ${({ $collapsed }) => ($collapsed ? 0 : "auto")};
  transition: opacity 0.2s ease;
`;

const BrandChevron = styled.span<{ $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  width: ${({ $collapsed }) => ($collapsed ? 0 : "auto")};
  overflow: hidden;
  transition: opacity 0.2s ease;
`;

const Nav = styled.nav<{ $collapsed?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: visible;
`;

const NavScroll = styled.div<{ $collapsed?: boolean }>`
  flex: 1;
  padding: 1rem ${({ $collapsed }) => ($collapsed ? "0.35rem" : "0.5rem")};
  overflow-y: auto;
  overflow-x: visible;

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
`;

const Footer = styled.div<{ $collapsed?: boolean }>`
  padding: ${({ $collapsed }) => ($collapsed ? "0.75rem 0.35rem" : "1rem")};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const StoreLink = styled(NavLink)<{ $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? "center" : "flex-start")};
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

  ${({ $collapsed }) =>
    $collapsed &&
    `
    padding: 0.65rem;
  `}
`;

const estoqueItems = [
  {
    to: adminRoutes.estoqueEntrada,
    icon: "box-arrow-in-down",
    label: "Entrada",
  },
  { to: adminRoutes.estoqueSaida, icon: "box-arrow-up", label: "Saída" },
  {
    to: adminRoutes.estoqueAdicionar,
    icon: "arrow-left-right",
    label: "Movimentações",
  },
  {
    to: adminRoutes.estoqueBaixo,
    icon: "exclamation-triangle-fill",
    label: "Estoque baixo",
  },
];

const clientesItems = [
  { to: adminRoutes.clientesLista, icon: "people", label: "Lista de clientes" },
  {
    to: adminRoutes.clientesSolicitacoes,
    icon: "inbox",
    label: "Solicitações e pedidos",
  },
];

const cadastrosItems = [
  { to: adminRoutes.cadastroAtendimento, icon: "headset", label: "Atendimento" },
  {
    to: adminRoutes.cadastroFornecedores,
    icon: "truck",
    label: "Fornecedores",
  },
];

export function AdminSidebar() {
  const { collapsed, toggleCollapsed } = useSidebar();
  const { perfil } = useSessao();

  return (
    <Aside $collapsed={collapsed}>
      <BrandButton
        type="button"
        onClick={toggleCollapsed}
        $collapsed={collapsed}
        title={collapsed ? "Expandir menu" : "Recolher menu"}
        aria-label={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
        aria-expanded={!collapsed}
      >
        <Icon name="wrench-adjustable" size={28} color="#c41e1e" />
        <BrandText $collapsed={collapsed}>JB Motos</BrandText>
        <BrandChevron $collapsed={collapsed} aria-hidden>
          <Icon
            name={collapsed ? "chevron-right" : "chevron-left"}
            size={16}
            color="currentColor"
          />
        </BrandChevron>
      </BrandButton>

      <Nav aria-label="Menu administrativo">
        <NavScroll $collapsed={collapsed}>
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
          <NavItemGroup
            label="Clientes"
            icon="person-badge"
            matchPaths={[adminRoutes.clientes]}
            items={clientesItems}
            collapsed={collapsed}
          />
          <NavItemGroup
            label="Estoque"
            icon="archive"
            matchPaths={[adminRoutes.estoque]}
            items={estoqueItems}
            collapsed={collapsed}
          />
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
          <NavItemGroup
            label="Cadastros"
            icon="folder-plus"
            matchPaths={[adminRoutes.cadastros, adminRoutes.cadastroAtendimento]}
            items={cadastrosItems}
            collapsed={collapsed}
          />
          <NavItem
            to={adminRoutes.administrativo}
            icon="shield-lock"
            label="Administrativo"
            collapsed={collapsed}
          />
          <NavItem
            to={adminRoutes.configuracoes}
            icon="gear"
            label="Configurações"
            collapsed={collapsed}
          />
        </ul>
        </NavScroll>
      </Nav>

      <Footer $collapsed={collapsed}>
        <StoreLink
          to={adminRoutes.loja}
          $collapsed={collapsed}
          title="Voltar para a loja"
        >
          <Icon name="shop" size={18} color="currentColor" />
          {!collapsed && <span>Voltar para a loja</span>}
        </StoreLink>
        {!collapsed && (
          <Text variant="caption" color="muted" style={{ marginTop: "0.75rem" }}>
            Perfil: {perfilSistemaLabels[perfil]}
          </Text>
        )}
      </Footer>
    </Aside>
  );
}
