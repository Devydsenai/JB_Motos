import { Icon } from "@components/atoms/Icon";
import {
  ActionButton,
  Page,
  PageButton,
  Pagination,
  Panel,
  ProductCell,
  ProductCode,
  ProductIcon,
  ProductName,
  SectionHeader,
  StatusBadge,
  SummaryCard,
  SummaryGrid,
  SummaryIcon,
  SummaryLabel,
  SummaryValue,
  Table,
  TableWrap,
} from "./EstoquePage.styles";

const resumoEstoque = [
  {
    label: "Total de produtos",
    value: "1.248",
    icon: "boxes",
    color: "#2563eb",
    bg: "#dbeafe",
  },
  {
    label: "Em estoque",
    value: "47",
    icon: "check-circle-fill",
    color: "#16a34a",
    bg: "#dcfce7",
  },
  {
    label: "Estoque baixo",
    value: "12",
    icon: "exclamation-triangle-fill",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  {
    label: "Fora de estoque",
    value: "3",
    icon: "x-circle-fill",
    color: "#dc2626",
    bg: "#fee2e2",
  },
];

const inventario = [
  {
    produto: "Óleo Motor 10W30",
    codigo: "PRD-001",
    fornecedor: "Distribuidora Alfa",
    categoria: "Lubrificantes",
    entrada: "26/04/2025",
    saida: "29/04/2025",
    compra: "R$31,00",
    unitario: "R$48,90",
    estoque: 48,
    status: "estavel" as const,
  },
  {
    produto: "Pastilha de Freio",
    codigo: "PRD-002",
    fornecedor: "Moto Peças Brasil",
    categoria: "Freios",
    entrada: "25/04/2025",
    saida: "29/04/2025",
    compra: "R$21,00",
    unitario: "R$35,00",
    estoque: 5,
    status: "critico" as const,
  },
  {
    produto: "Pneu Traseiro 90/90",
    codigo: "PRD-003",
    fornecedor: "Pneus Prime",
    categoria: "Pneus",
    entrada: "24/04/2025",
    saida: "28/04/2025",
    compra: "R$132,00",
    unitario: "R$189,90",
    estoque: 12,
    status: "baixo" as const,
  },
  {
    produto: "Capacete Pro Tork",
    codigo: "PRD-004",
    fornecedor: "Distribuidora Alfa",
    categoria: "Acessórios",
    entrada: "22/04/2025",
    saida: "27/04/2025",
    compra: "R$170,00",
    unitario: "R$249,90",
    estoque: 32,
    status: "estavel" as const,
  },
  {
    produto: "Kit Relação CG 160",
    codigo: "PRD-005",
    fornecedor: "Moto Peças Brasil",
    categoria: "Transmissão",
    entrada: "21/04/2025",
    saida: "29/04/2025",
    compra: "R$98,00",
    unitario: "R$142,50",
    estoque: 18,
    status: "estavel" as const,
  },
  {
    produto: "Filtro de Ar",
    codigo: "PRD-006",
    fornecedor: "Peças Rápidas",
    categoria: "Motor",
    entrada: "20/04/2025",
    saida: "28/04/2025",
    compra: "R$16,00",
    unitario: "R$28,90",
    estoque: 3,
    status: "critico" as const,
  },
];

const statusLabels = {
  estavel: "Estável",
  baixo: "Baixo",
  critico: "Crítico",
};

export function EstoquePage() {
  return (
    <Page>
      <SummaryGrid>
        {resumoEstoque.map((item) => (
          <SummaryCard key={item.label}>
            <div>
              <SummaryLabel>{item.label}</SummaryLabel>
              <SummaryValue>{item.value}</SummaryValue>
            </div>
            <SummaryIcon $color={item.color} $bg={item.bg}>
              <Icon name={item.icon} size={21} color={item.color} />
            </SummaryIcon>
          </SummaryCard>
        ))}
      </SummaryGrid>

      <SectionHeader>
        <div>
          <h1>Inventário de produtos</h1>
          <p>Gerencie seus itens de estoque e níveis de inventário</p>
        </div>
        <ActionButton type="button">
          <Icon name="file-earmark-arrow-up" size={14} color="#fff" />
          Exportar
        </ActionButton>
      </SectionHeader>

      <Panel>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Fornecedor</th>
                <th>Categoria</th>
                <th>Dt ult. entrada</th>
                <th>Dt ult. saída</th>
                <th>Valor compra</th>
                <th>Valor unit</th>
                <th>Estoque total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((produto) => (
                <tr key={produto.codigo}>
                  <td>
                    <ProductCell>
                      <ProductIcon>
                        <Icon name="receipt" size={18} color="#fff" />
                      </ProductIcon>
                      <div>
                        <ProductName>{produto.produto}</ProductName>
                        <ProductCode>{produto.codigo}</ProductCode>
                      </div>
                    </ProductCell>
                  </td>
                  <td>{produto.fornecedor}</td>
                  <td>{produto.categoria}</td>
                  <td>{produto.entrada}</td>
                  <td>{produto.saida}</td>
                  <td>{produto.compra}</td>
                  <td>{produto.unitario}</td>
                  <td>{produto.estoque}</td>
                  <td>
                    <StatusBadge $status={produto.status}>
                      {statusLabels[produto.status]}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>

        <Pagination aria-label="Paginação do estoque">
          <Icon name="chevron-left" size={12} />
          <PageButton type="button" $active>
            1
          </PageButton>
          <PageButton type="button">2</PageButton>
          <PageButton type="button">3</PageButton>
          <PageButton type="button">4</PageButton>
          <PageButton type="button">5</PageButton>
          <Icon name="chevron-right" size={12} />
        </Pagination>
      </Panel>
    </Page>
  );
}
