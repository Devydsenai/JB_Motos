import { useState } from "react";
import styled from "styled-components";
import { SearchBar } from "@components/molecules/SearchBar";
import { AlertBadge } from "@components/molecules/AlertBadge";
import { DropdownMenu } from "@components/molecules/DropdownMenu";
import { ThemeToggle } from "@components/molecules/ThemeToggle";
import { Text } from "@components/atoms/Text";
import { adminRoutes, MOCK_ALERTAS_ESTOQUE } from "@/config/adminMenu";

const Header = styled.header`
  height: ${({ theme }) => theme.layout.headerHeight};
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: auto;
`;

const SearchResult = styled.p`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  max-width: 480px;
`;

export interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title = "Painel Administrativo" }: AdminHeaderProps) {
  const [lastSearch, setLastSearch] = useState<string | null>(null);

  return (
    <Header>
      <Text as="h2" variant="h3" weight="semibold">
        {title}
      </Text>

      <SearchWrap>
        <SearchBar
          placeholder="Buscar produtos, serviços solicitados..."
          onSearch={(q) => setLastSearch(q || null)}
        />
        {lastSearch && (
          <SearchResult>
            Busca registrada: &quot;{lastSearch}&quot; (integração com API em breve)
          </SearchResult>
        )}
      </SearchWrap>

      <Actions>
        <ThemeToggle />
        <AlertBadge
          to={adminRoutes.requisicoes}
          icon="exclamation-triangle-fill"
          count={MOCK_ALERTAS_ESTOQUE}
          title={`${MOCK_ALERTAS_ESTOQUE} produto(s) com estoque baixo`}
        />
        <AlertBadge
          to={adminRoutes.requisicoes}
          icon="clipboard-plus"
          count={0}
          title="Requisições pendentes"
        />
        <DropdownMenu
          label="Menu"
          icon="list"
          items={[
            { label: "Configurações", icon: "gear", onClick: () => {} },
            {
              label: "Voltar para a loja",
              icon: "shop",
              href: adminRoutes.loja,
            },
          ]}
        />
      </Actions>
    </Header>
  );
}
