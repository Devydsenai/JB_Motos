import { Icon } from "@components/atoms/Icon";
import type {
  AtividadeRecente,
  ProdutoEstoqueDashboard,
  StatusEstoque,
} from "@/data/mockDashboard";
import {
  ActivityDetails,
  ActivityIcon,
  ActivityItem,
  ActivityList,
  ActivitySubtitle,
  ActivityTitle,
  OperationsGrid,
  OperationsPanel,
  PanelAction,
  PanelHeader,
  ProductCell,
  ProductCode,
  ProductIcon,
  ProductInfo,
  ProductName,
  StockBar,
  StockBarFill,
  StockStatusBadge,
  StockTable,
  StockText,
} from "./DashboardPage.styles";

type Props = {
  atividades: AtividadeRecente[];
  statusEstoque: ProdutoEstoqueDashboard[];
};

const statusLabels: Record<StatusEstoque, string> = {
  estavel: "Estável",
  atencao: "Atenção",
  critico: "Crítico",
};

export function DashboardOperationsPanel({ atividades, statusEstoque }: Props) {
  return (
    <OperationsGrid>
      <OperationsPanel>
        <PanelHeader>
          <h2>Atividades recentes</h2>
        </PanelHeader>

        <ActivityList>
          {atividades.map((atividade) => (
            <ActivityItem key={atividade.id}>
              <ActivityIcon $color={atividade.cor} $bg={atividade.fundo}>
                <Icon name={atividade.icon} size={18} color={atividade.cor} />
              </ActivityIcon>
              <ActivityDetails>
                <ActivityTitle>{atividade.titulo}</ActivityTitle>
                <ActivitySubtitle>
                  {atividade.descricao} - {atividade.tempo}
                </ActivitySubtitle>
              </ActivityDetails>
            </ActivityItem>
          ))}
        </ActivityList>
      </OperationsPanel>

      <OperationsPanel>
        <PanelHeader>
          <h2>Status do estoque</h2>
          <PanelAction type="button">Ver todos</PanelAction>
        </PanelHeader>

        <StockTable>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Código</th>
              <th>Categoria</th>
              <th>Estoque total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {statusEstoque.map((produto) => {
              const percentual = Math.min(
                (produto.estoque / produto.estoqueMaximo) * 100,
                100,
              );

              return (
                <tr key={produto.id}>
                  <td>
                    <ProductCell>
                      <ProductIcon $color={produto.cor} $bg={produto.fundo}>
                        <Icon name={produto.icon} size={17} color={produto.cor} />
                      </ProductIcon>
                      <ProductInfo>
                        <ProductName>{produto.produto}</ProductName>
                        <ProductCode>#{produto.codigo}</ProductCode>
                      </ProductInfo>
                    </ProductCell>
                  </td>
                  <td>{produto.codigo}</td>
                  <td>{produto.categoria}</td>
                  <td>
                    <StockText>{produto.estoque} unidades</StockText>
                    <StockBar>
                      <StockBarFill
                        $color={produto.cor}
                        style={{ width: `${percentual}%` }}
                      />
                    </StockBar>
                  </td>
                  <td>
                    <StockStatusBadge $status={produto.status}>
                      {statusLabels[produto.status]}
                    </StockStatusBadge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </StockTable>
      </OperationsPanel>
    </OperationsGrid>
  );
}
