import { Icon } from "@components/atoms/Icon";
import {
  ActionButton,
  IconButton,
  MovementBadge,
  Page,
  PageButton,
  Pagination,
  Panel,
  ProductCell,
  ProductCode,
  ProductIcon,
  ProductName,
  RowActions,
  SectionHeader,
  SummaryCard,
  SummaryGrid,
  SummaryIcon,
  SummaryLabel,
  SummaryValue,
  Table,
  TableWrap,
} from "../EstoquePage/EstoquePage.styles";

type Saida = {
  id: string;
  data: string;
  produto: string;
  codigo: string;
  quantidade: string;
  estoqueAtual: string;
  servico: string;
  moto: string;
  responsavel: string;
  motivo: string;
};

const saidasIniciais: Saida[] = [
  {
    id: "sai-001",
    data: "29/04/2025 15:57",
    produto: "Pastilha de Freio",
    codigo: "PRD-002",
    quantidade: "-2",
    estoqueAtual: "5",
    servico: "Troca de pastilha de freio",
    moto: "Honda CG 160",
    responsavel: "Mecânico Carlos",
    motivo: "Serviço concluído",
  },
  {
    id: "sai-002",
    data: "29/04/2025 13:40",
    produto: "Óleo Motor 10W30",
    codigo: "PRD-001",
    quantidade: "-1",
    estoqueAtual: "48",
    servico: "Troca de óleo",
    moto: "Yamaha Fazer 250",
    responsavel: "Mecânico Paulo",
    motivo: "Serviço concluído",
  },
  {
    id: "sai-003",
    data: "28/04/2025 17:12",
    produto: "Kit Relação CG 160",
    codigo: "PRD-005",
    quantidade: "-1",
    estoqueAtual: "18",
    servico: "Substituição de relação",
    moto: "Honda CG 160",
    responsavel: "Mecânico Carlos",
    motivo: "Serviço concluído",
  },
];

const resumoSaida = [
  {
    label: "Saídas do mês",
    value: "89",
    icon: "box-arrow-up",
    color: "#c41e1e",
    bg: "#fee2e2",
  },
  {
    label: "Serviços concluídos",
    value: "32",
    icon: "tools",
    color: "#c41e1e",
    bg: "#fee2e2",
  },
  {
    label: "Peças utilizadas",
    value: "156",
    icon: "boxes",
    color: "#c41e1e",
    bg: "#fee2e2",
  },
  {
    label: "Aguardando baixa",
    value: "6",
    icon: "hourglass-split",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
];

export function EstoqueSaidaPage() {
  return (
    <Page>
      <SummaryGrid>
        {resumoSaida.map((item) => (
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
          <h1>Saída do estoque</h1>
          <p>Peças que saíram do estoque após conclusão de serviço</p>
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
                <th>Data/hora</th>
                <th>Tipo</th>
                <th>Produto / peça</th>
                <th>Quantidade</th>
                <th>Estoque atual</th>
                <th>Serviço</th>
                <th>Moto</th>
                <th>Responsável</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {saidasIniciais.map((saida) => (
                <tr key={saida.id}>
                  <td>{saida.data}</td>
                  <td>
                    <MovementBadge $type="saida">Saída</MovementBadge>
                  </td>
                  <td>
                    <ProductCell>
                      <ProductIcon>
                        <Icon name="box-arrow-up" size={18} color="#fff" />
                      </ProductIcon>
                      <div>
                        <ProductName>{saida.produto}</ProductName>
                        <ProductCode>{saida.codigo}</ProductCode>
                      </div>
                    </ProductCell>
                  </td>
                  <td>{saida.quantidade}</td>
                  <td>{saida.estoqueAtual}</td>
                  <td>{saida.servico}</td>
                  <td>{saida.moto}</td>
                  <td>{saida.responsavel}</td>
                  <td>
                    <RowActions>
                      <IconButton type="button" aria-label="Visualizar saída">
                        <Icon name="eye-fill" size={16} />
                      </IconButton>
                      <IconButton type="button" aria-label="Excluir saída">
                        <Icon name="trash-fill" size={16} />
                      </IconButton>
                    </RowActions>
                  </td>
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
