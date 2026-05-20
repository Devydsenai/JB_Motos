import { useMemo } from "react";
import { Icon } from "@components/atoms/Icon";
import { useProdutos } from "@/contexts/ProdutosContext";
import {
  estoqueStatusLabels,
  listarProdutosEstoqueBaixo,
  parseQuantidade,
} from "@/utils/produtoEstoque";
import { exportReport, exportReportPdf } from "@/utils/exportReports";
import type { EstoqueStatus } from "@/types/produto";
import {
  ActionButton,
  Page,
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
} from "../EstoquePage/EstoquePage.styles";

const statusBadgeMap = (
  status: EstoqueStatus,
): "estavel" | "baixo" | "critico" => {
  if (status === "zerado") return "critico";
  if (status === "critico") return "critico";
  if (status === "baixo") return "baixo";
  return "estavel";
};

export function EstoqueBaixoPage() {
  const { produtos } = useProdutos();

  const alertas = useMemo(
    () => listarProdutosEstoqueBaixo(produtos),
    [produtos],
  );

  const resumo = useMemo(() => {
    const zerado = alertas.filter((p) => p.statusEstoque === "zerado").length;
    const critico = alertas.filter((p) => p.statusEstoque === "critico").length;
    const baixo = alertas.filter((p) => p.statusEstoque === "baixo").length;
    return { total: alertas.length, zerado, critico, baixo };
  }, [alertas]);

  const exportar = () => {
    exportReport({
      title: "Relatório — Estoque baixo",
      fileName: "estoque-baixo",
      columns: [
        "Produto",
        "Código",
        "Categoria",
        "Qtd. atual",
        "Qtd. mínima",
        "Status",
        "Fornecedor",
        "Localização",
      ],
      rows: alertas.map((p) => [
        p.produto,
        p.codigo,
        p.categoria,
        p.quantidade,
        p.quantidadeMinima,
        estoqueStatusLabels[p.statusEstoque],
        p.fornecedor,
        p.localizacao,
      ]),
    });
  };

  const exportarPdf = () => {
    exportReportPdf({
      title: "Relatório — Estoque baixo",
      fileName: "estoque-baixo",
      columns: [
        "Produto",
        "Código",
        "Qtd. atual",
        "Qtd. mínima",
        "Status",
        "Fornecedor",
      ],
      rows: alertas.map((p) => [
        p.produto,
        p.codigo,
        p.quantidade,
        p.quantidadeMinima,
        estoqueStatusLabels[p.statusEstoque],
        p.fornecedor,
      ]),
    });
  };

  const cards = [
    {
      label: "Total em alerta",
      value: resumo.total,
      icon: "exclamation-triangle-fill",
      color: "#d97706",
      bg: "#fef3c7",
    },
    {
      label: "Sem estoque",
      value: resumo.zerado,
      icon: "x-circle-fill",
      color: "#dc2626",
      bg: "#fee2e2",
    },
    {
      label: "Crítico",
      value: resumo.critico,
      icon: "exclamation-octagon-fill",
      color: "#b91c1c",
      bg: "#fecaca",
    },
    {
      label: "Estoque baixo",
      value: resumo.baixo,
      icon: "arrow-down-circle-fill",
      color: "#b45309",
      bg: "#ffedd5",
    },
  ];

  return (
    <Page>
      <SummaryGrid>
        {cards.map((card) => (
          <SummaryCard key={card.label}>
            <div>
              <SummaryLabel>{card.label}</SummaryLabel>
              <SummaryValue>{card.value}</SummaryValue>
            </div>
            <SummaryIcon $color={card.color} $bg={card.bg}>
              <Icon name={card.icon} size={22} color={card.color} />
            </SummaryIcon>
          </SummaryCard>
        ))}
      </SummaryGrid>

      <Panel>
        <SectionHeader>
          <div>
            <h1>Relatório de estoque baixo</h1>
            <p>
              Produtos com quantidade no ou abaixo do mínimo cadastrado. Atualize
              o estoque em Produtos ou Entrada de mercadorias.
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <ActionButton type="button" onClick={exportarPdf}>
              <Icon name="file-earmark-pdf" size={16} color="#fff" />
              Relatório PDF
            </ActionButton>
            <ActionButton type="button" onClick={exportar}>
              <Icon name="download" size={16} color="#fff" />
              Exportar
            </ActionButton>
          </div>
        </SectionHeader>

        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Qtd. atual</th>
                <th>Qtd. mínima</th>
                <th>Status</th>
                <th>Fornecedor</th>
                <th>Localização</th>
              </tr>
            </thead>
            <tbody>
              {alertas.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "2rem" }}>
                    Nenhum produto com estoque baixo no momento.
                  </td>
                </tr>
              ) : (
                alertas.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <ProductCell>
                        <ProductIcon>
                          <Icon name="box-seam" size={18} color="#c41e1e" />
                        </ProductIcon>
                        <div>
                          <ProductName>{p.produto}</ProductName>
                          <ProductCode>{p.codigo}</ProductCode>
                        </div>
                      </ProductCell>
                    </td>
                    <td>{p.categoria}</td>
                    <td>{parseQuantidade(p.quantidade)}</td>
                    <td>{parseQuantidade(p.quantidadeMinima)}</td>
                    <td>
                      <StatusBadge $status={statusBadgeMap(p.statusEstoque)}>
                        {p.statusEstoque === "zerado"
                          ? "Sem estoque"
                          : estoqueStatusLabels[p.statusEstoque]}
                      </StatusBadge>
                    </td>
                    <td>{p.fornecedor}</td>
                    <td>{p.localizacao || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableWrap>
      </Panel>
    </Page>
  );
}
