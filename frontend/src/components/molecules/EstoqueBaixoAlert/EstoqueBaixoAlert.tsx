import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@components/atoms/Icon";
import { useProdutos } from "@/contexts/ProdutosContext";
import { adminRoutes } from "@/config/adminMenu";
import {
  estoqueStatusLabels,
  listarProdutosEstoqueBaixo,
  parseQuantidade,
} from "@/utils/produtoEstoque";
import { exportReportPdf } from "@/utils/exportReports";
import {
  Count,
  EmptyState,
  FooterButton,
  FooterLink,
  ItemLink,
  ItemMeta,
  ItemName,
  ItemTop,
  Panel,
  PanelFooter,
  PanelHeader,
  PanelItem,
  PanelList,
  StatusChip,
  Trigger,
  Wrapper,
} from "./EstoqueBaixoAlert.styles";

const MAX_ITENS_PAINEL = 8;

export function EstoqueBaixoAlert() {
  const { produtos } = useProdutos();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const alertas = useMemo(
    () => listarProdutosEstoqueBaixo(produtos),
    [produtos],
  );

  const count = alertas.length;
  const preview = alertas.slice(0, MAX_ITENS_PAINEL);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setOpen(false);
  };

  return (
    <Wrapper ref={ref}>
      <Trigger
        type="button"
        $hasAlert={count > 0}
        title={
          count > 0
            ? `${count} produto(s) com estoque baixo`
            : "Nenhum alerta de estoque"
        }
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon
          name="exclamation-triangle-fill"
          size={20}
          color={count > 0 ? "#d97706" : undefined}
        />
        {count > 0 && <Count>{count > 99 ? "99+" : count}</Count>}
      </Trigger>

      <Panel $open={open} role="dialog" aria-label="Alertas de estoque baixo">
        <PanelHeader>
          <h3>Estoque baixo</h3>
          <p>
            {count > 0
              ? `${count} produto(s) abaixo do mínimo ou sem estoque`
              : "Todos os produtos estão com estoque adequado"}
          </p>
        </PanelHeader>

        {count === 0 ? (
          <EmptyState>
            <Icon name="check-circle-fill" size={28} color="#16a34a" />
            <br />
            Nenhum alerta no momento
          </EmptyState>
        ) : (
          <PanelList>
            {preview.map((p) => (
              <PanelItem key={p.id}>
                <ItemLink
                  to={adminRoutes.produtos}
                  onClick={() => setOpen(false)}
                >
                  <ItemTop>
                    <ItemName>{p.produto}</ItemName>
                    <StatusChip $status={p.statusEstoque}>
                      {estoqueStatusLabels[p.statusEstoque]}
                    </StatusChip>
                  </ItemTop>
                  <ItemMeta>
                    {p.codigo} · Atual: {parseQuantidade(p.quantidade)} · Mín.:{" "}
                    {parseQuantidade(p.quantidadeMinima)}
                  </ItemMeta>
                </ItemLink>
              </PanelItem>
            ))}
            {count > MAX_ITENS_PAINEL && (
              <PanelItem>
                <ItemMeta style={{ padding: "0.65rem 1rem", textAlign: "center" }}>
                  + {count - MAX_ITENS_PAINEL} produto(s) no relatório completo
                </ItemMeta>
              </PanelItem>
            )}
          </PanelList>
        )}

        <PanelFooter>
          {count > 0 && (
            <FooterButton type="button" onClick={exportarPdf}>
              <Icon name="file-earmark-pdf" size={14} />
              Exportar relatório PDF
            </FooterButton>
          )}
          <FooterLink to={adminRoutes.estoqueBaixo} onClick={() => setOpen(false)}>
            <Icon name="box-seam" size={16} color="#fff" />
            Ver relatório completo
          </FooterLink>
        </PanelFooter>
      </Panel>
    </Wrapper>
  );
}
