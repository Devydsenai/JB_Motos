import { Icon } from "@components/atoms/Icon";
import { exportReport } from "@/utils/exportReports";
import {
  ActionButton,
  MovementBadge,
  Page,
  PageButton,
  Pagination,
  Panel,
  ProductCell,
  ProductCode,
  ProductIcon,
  ProductName,
  SectionHeader,
  SummaryCard,
  SummaryGrid,
  SummaryIcon,
  SummaryLabel,
  SummaryValue,
  Table,
  TableWrap,
} from "../EstoquePage/EstoquePage.styles";

type Entrada = {
  id: string;
  data: string;
  produto: string;
  codigo: string;
  quantidade: string;
  estoqueAtual: string;
  fornecedor: string;
  motivo: string;
  responsavel: string;
};

const entradasIniciais: Entrada[] = [
  {
    id: "ent-001",
    data: "29/04/2025 15:57",
    produto: "Óleo Motor 10W30",
    codigo: "PRD-001",
    quantidade: "+10",
    estoqueAtual: "58",
    fornecedor: "Distribuidora Alfa",
    motivo: "Compra",
    responsavel: "Juliana Albuquerque",
  },
  {
    id: "ent-002",
    data: "29/04/2025 14:20",
    produto: "Pastilha de Freio",
    codigo: "PRD-002",
    quantidade: "+20",
    estoqueAtual: "25",
    fornecedor: "Moto Peças Brasil",
    motivo: "Reposição",
    responsavel: "Juliana Albuquerque",
  },
  {
    id: "ent-003",
    data: "28/04/2025 11:10",
    produto: "Pneu Traseiro 90/90",
    codigo: "PRD-003",
    quantidade: "+8",
    estoqueAtual: "20",
    fornecedor: "Pneus Prime",
    motivo: "Compra",
    responsavel: "Juliana Albuquerque",
  },
];

const resumoEntrada = [
  {
    label: "Entradas do mês",
    value: "156",
    icon: "box-arrow-in-down",
    color: "#16a34a",
    bg: "#dcfce7",
  },
  {
    label: "Fornecedores ativos",
    value: "18",
    icon: "truck",
    color: "#16a34a",
    bg: "#dcfce7",
  },
  {
    label: "Peças recebidas",
    value: "910",
    icon: "boxes",
    color: "#16a34a",
    bg: "#dcfce7",
  },
  {
    label: "Conferências pendentes",
    value: "4",
    icon: "clipboard-check",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
];

export function EstoqueEntradaPage() {
  const exportarEntradas = () => {
    exportReport({
      title: "Relatório de entradas do estoque",
      fileName: "relatorio-entradas-estoque",
      columns: [
        "Data/hora",
        "Tipo",
        "Produto",
        "Código",
        "Quantidade",
        "Estoque atual",
        "Fornecedor",
        "Responsável",
        "Motivo",
      ],
      rows: entradasIniciais.map((entrada) => [
        entrada.data,
        "Entrada",
        entrada.produto,
        entrada.codigo,
        entrada.quantidade,
        entrada.estoqueAtual,
        entrada.fornecedor,
        entrada.responsavel,
        entrada.motivo,
      ]),
    });
  };

  return (
    <Page>
      <SummaryGrid>
        {resumoEntrada.map((item) => (
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
          <h1>Entrada do estoque</h1>
          <p>Produtos recebidos, fornecedores e quantidades que entraram</p>
        </div>
        <ActionButton type="button" onClick={exportarEntradas}>
          <Icon name="file-earmark-arrow-up" size={14} color="#fff" />
          Exportar
        </ActionButton>
      </SectionHeader>

      <Panel>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Data/hora</th>
                <th>Tipo</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Estoque atual</th>
                <th>Fornecedor</th>
                <th>Responsável</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {entradasIniciais.map((entrada) => (
                <tr key={entrada.id}>
                  <td>{entrada.data}</td>
                  <td>
                    <MovementBadge $type="entrada">Entrada</MovementBadge>
                  </td>
                  <td>
                    <ProductCell>
                      <ProductIcon>
                        <Icon name="box-arrow-in-down" size={18} color="#fff" />
                      </ProductIcon>
                      <div>
                        <ProductName>{entrada.produto}</ProductName>
                        <ProductCode>{entrada.codigo}</ProductCode>
                      </div>
                    </ProductCell>
                  </td>
                  <td>{entrada.quantidade}</td>
                  <td>{entrada.estoqueAtual}</td>
                  <td>{entrada.fornecedor}</td>
                  <td>{entrada.responsavel}</td>
                  <td>{entrada.motivo}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
        <Pagination>
          <Icon name="chevron-left" size={12} />
          <PageButton type="button" $active>
            1
          </PageButton>
          <PageButton type="button">2</PageButton>
          <PageButton type="button">3</PageButton>
          <Icon name="chevron-right" size={12} />
        </Pagination>
      </Panel>
    </Page>
  );
}
