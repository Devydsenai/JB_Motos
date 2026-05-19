import { useState, type FormEvent } from "react";
import { Icon } from "@components/atoms/Icon";
import {
  ActionButton,
  Field,
  FormActions,
  FormGrid,
  FormTitle,
  FullField,
  GhostButton,
  IconButton,
  MovementBadge,
  MovementForm,
  MovementTypeGrid,
  Page,
  PageButton,
  Pagination,
  Panel,
  RowActions,
  SectionHeader,
  Table,
  TableWrap,
  TypeButton,
} from "../EstoquePage/EstoquePage.styles";

type TipoMovimentacao = "entrada" | "saida" | "ajuste";

type Movimentacao = {
  id: string;
  data: string;
  tipo: TipoMovimentacao;
  produto: string;
  quantidade: string;
  estoqueAtual: string;
  responsavel: string;
  motivo: string;
};

const historicoInicial: Movimentacao[] = [
  {
    id: "mov-001",
    data: "29/04/2025 15:57",
    tipo: "entrada",
    produto: "Óleo Motor 10W30",
    quantidade: "+10",
    estoqueAtual: "58",
    responsavel: "Juliana Albuquerque",
    motivo: "Compra",
  },
  {
    id: "mov-002",
    data: "29/04/2025 14:22",
    tipo: "saida",
    produto: "Pastilha de Freio",
    quantidade: "-2",
    estoqueAtual: "5",
    responsavel: "Mecânico Carlos",
    motivo: "Serviço concluído",
  },
  {
    id: "mov-003",
    data: "28/04/2025 10:40",
    tipo: "ajuste",
    produto: "Pneu Traseiro 90/90",
    quantidade: "1",
    estoqueAtual: "12",
    responsavel: "Juliana Albuquerque",
    motivo: "Conferência",
  },
];

export function EstoqueAdicionarPage() {
  const [tipo, setTipo] = useState<TipoMovimentacao>("entrada");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [motivo, setMotivo] = useState("");
  const [data, setData] = useState("2025-04-29T15:25");
  const [observacoes, setObservacoes] = useState("");
  const [historico, setHistorico] = useState(historicoInicial);

  const salvarMovimentacao = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sinal = tipo === "entrada" ? "+" : tipo === "saida" ? "-" : "";

    setHistorico((atual) => [
      {
        id: `mov-${Date.now()}`,
        data: new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(data)),
        tipo,
        produto: produto || "Produto sem nome",
        quantidade: `${sinal}${quantidade || "0"}`,
        estoqueAtual: "Atualizar no backend",
        responsavel: "Juliana Albuquerque",
        motivo: motivo || "Movimentação manual",
      },
      ...atual,
    ]);

    setProduto("");
    setQuantidade("");
    setMotivo("");
    setObservacoes("");
  };

  return (
    <Page>
      <MovementForm onSubmit={salvarMovimentacao}>
        <FormTitle>
          <Icon name="plus-circle-fill" size={18} color="#c41e1e" />
          Nova movimentação
        </FormTitle>

        <MovementTypeGrid>
          <TypeButton
            type="button"
            $active={tipo === "entrada"}
            onClick={() => setTipo("entrada")}
          >
            <Icon name="arrow-down" size={14} />
            Entrada
          </TypeButton>
          <TypeButton
            type="button"
            $active={tipo === "saida"}
            onClick={() => setTipo("saida")}
          >
            <Icon name="arrow-up" size={14} />
            Saída
          </TypeButton>
          <TypeButton
            type="button"
            $active={tipo === "ajuste"}
            onClick={() => setTipo("ajuste")}
          >
            <Icon name="sliders" size={14} />
            Ajuste
          </TypeButton>
        </MovementTypeGrid>

        <FormGrid>
          <Field>
            Produto *
            <input
              value={produto}
              onChange={(event) => setProduto(event.target.value)}
              placeholder="Busque por nome ou código"
            />
          </Field>
          <Field>
            Motivo
            <select value={motivo} onChange={(event) => setMotivo(event.target.value)}>
              <option value="">Selecione uma categoria</option>
              <option>Compra</option>
              <option>Reposição</option>
              <option>Serviço concluído</option>
              <option>Conferência</option>
            </select>
          </Field>
          <Field>
            Quantidade *
            <input
              value={quantidade}
              onChange={(event) => setQuantidade(event.target.value)}
              placeholder="Digite a quantidade"
            />
          </Field>
          <Field>
            Data da movimentação
            <input
              type="datetime-local"
              value={data}
              onChange={(event) => setData(event.target.value)}
            />
          </Field>
          <FullField>
            Observações
            <textarea
              value={observacoes}
              onChange={(event) => setObservacoes(event.target.value)}
              placeholder="Adicione observações relevantes"
            />
          </FullField>
        </FormGrid>

        <FormActions>
          <GhostButton type="button">
            <Icon name="x-lg" size={13} />
            Cancelar
          </GhostButton>
          <ActionButton type="submit">
            <Icon name="floppy-fill" size={14} color="#fff" />
            Salvar movimentação
          </ActionButton>
        </FormActions>
      </MovementForm>

      <SectionHeader>
        <div>
          <h2>Histórico de movimentações</h2>
          <p>Entradas, saídas e ajustes manuais do estoque</p>
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
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Estoque atual</th>
                <th>Responsável</th>
                <th>Motivo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((item) => (
                <tr key={item.id}>
                  <td>{item.data}</td>
                  <td>
                    <MovementBadge $type={item.tipo}>
                      {item.tipo === "entrada"
                        ? "Entrada"
                        : item.tipo === "saida"
                          ? "Saída"
                          : "Ajuste"}
                    </MovementBadge>
                  </td>
                  <td>{item.produto}</td>
                  <td>{item.quantidade}</td>
                  <td>{item.estoqueAtual}</td>
                  <td>{item.responsavel}</td>
                  <td>{item.motivo}</td>
                  <td>
                    <RowActions>
                      <IconButton type="button" aria-label="Visualizar movimentação">
                        <Icon name="eye-fill" size={16} />
                      </IconButton>
                      <IconButton type="button" aria-label="Excluir movimentação">
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
