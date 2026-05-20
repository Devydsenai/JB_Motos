import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import { adminRoutes } from "@/config/adminMenu";
import { useProdutos } from "@/contexts/ProdutosContext";
import {
  estoqueStatusLabels,
  getProdutoEstoqueStatus,
  parseQuantidade,
} from "@/utils/produtoEstoque";
import {
  ActionButton,
  EmptyRow,
  EstoqueBadge,
  FilterSelect,
  HeaderActions,
  InfoBanner,
  LojaToggle,
  OutlineButton,
  Page,
  Panel,
  PanelHeader,
  PanelTitle,
  ProductCell,
  ProductIcon,
  ProductMeta,
  ProductName,
  SearchField,
  SummaryCard,
  SummaryGrid,
  SummaryIcon,
  SummaryInfo,
  SummaryLabel,
  SummaryValue,
  Table,
  TableWrap,
  Toast,
  Toolbar,
} from "./CadastroProdutosPage.styles";

type FiltroVitrine = "todos" | "na-loja" | "fora-loja" | "estoque-baixo";

export function CadastroProdutosPage() {
  const { produtos, toggleVisivelLoja, inativarNaLojaPorEstoqueBaixo } =
    useProdutos();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroVitrine>("todos");
  const [toast, setToast] = useState<string | null>(null);

  const cadastrados = produtos.filter((p) => p.ativo);

  const resumo = useMemo(() => {
    const naLoja = produtos.filter((p) => p.visivelLoja).length;
    const foraLoja = produtos.filter((p) => !p.visivelLoja).length;
    const estoqueBaixo = produtos.filter((p) => {
      const s = getProdutoEstoqueStatus(p);
      return s === "baixo" || s === "critico" || s === "zerado";
    }).length;

    return { naLoja, foraLoja, estoqueBaixo, total: produtos.length };
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return produtos.filter((produto) => {
      const status = getProdutoEstoqueStatus(produto);
      const matchBusca =
        !termo ||
        produto.produto.toLowerCase().includes(termo) ||
        produto.codigo.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo);

      if (!matchBusca) return false;

      switch (filtro) {
        case "na-loja":
          return produto.visivelLoja;
        case "fora-loja":
          return !produto.visivelLoja;
        case "estoque-baixo":
          return (
            status === "baixo" || status === "critico" || status === "zerado"
          );
        default:
          return true;
      }
    });
  }, [produtos, busca, filtro]);

  const aplicarSugestaoEstoque = () => {
    const qtd = inativarNaLojaPorEstoqueBaixo();
    setToast(
      qtd > 0
        ? `${qtd} produto(s) removido(s) da vitrine por estoque baixo ou zerado.`
        : "Nenhum produto na loja precisava ser ocultado por estoque.",
    );
  };

  return (
    <Page>
      <SummaryGrid>
        <SummaryCard>
          <SummaryInfo>
            <SummaryLabel>Produtos cadastrados</SummaryLabel>
            <SummaryValue>{resumo.total}</SummaryValue>
          </SummaryInfo>
          <SummaryIcon $color="#2563eb" $bg="#dbeafe">
            <Icon name="box-seam" size={21} color="#2563eb" />
          </SummaryIcon>
        </SummaryCard>
        <SummaryCard>
          <SummaryInfo>
            <SummaryLabel>Na loja (vitrine)</SummaryLabel>
            <SummaryValue>{resumo.naLoja}</SummaryValue>
          </SummaryInfo>
          <SummaryIcon $color="#16a34a" $bg="#dcfce7">
            <Icon name="shop-window" size={21} color="#16a34a" />
          </SummaryIcon>
        </SummaryCard>
        <SummaryCard>
          <SummaryInfo>
            <SummaryLabel>Fora da loja</SummaryLabel>
            <SummaryValue>{resumo.foraLoja}</SummaryValue>
          </SummaryInfo>
          <SummaryIcon $color="#6b7280" $bg="#f3f4f6">
            <Icon name="eye-slash" size={21} color="#6b7280" />
          </SummaryIcon>
        </SummaryCard>
        <SummaryCard>
          <SummaryInfo>
            <SummaryLabel>Estoque baixo / crítico</SummaryLabel>
            <SummaryValue>{resumo.estoqueBaixo}</SummaryValue>
          </SummaryInfo>
          <SummaryIcon $color="#d97706" $bg="#fef3c7">
            <Icon name="exclamation-triangle-fill" size={21} color="#d97706" />
          </SummaryIcon>
        </SummaryCard>
      </SummaryGrid>

      <InfoBanner>
        Aqui você define o que aparece na <strong>loja</strong> para o cliente.
        O cadastro completo (nome, preço, estoque) fica em{" "}
        <Link to={adminRoutes.produtos}>Produtos</Link>. Use{" "}
        <strong>Na loja</strong> para promover um item já cadastrado; desative
        quando o estoque estiver baixo.
      </InfoBanner>

      {toast && <Toast $type="success">{toast}</Toast>}

      <PanelHeader>
        <PanelTitle>
          <h1>Produtos na vitrine da loja</h1>
          <p>
            {cadastrados.length} ativos no inventário · {resumo.naLoja} visíveis
            para o catálogo da loja
          </p>
        </PanelTitle>
        <HeaderActions>
          <OutlineButton type="button" onClick={aplicarSugestaoEstoque}>
            Ocultar estoque baixo
          </OutlineButton>
          <Link
            to={adminRoutes.produtos}
            style={{ textDecoration: "none" }}
          >
            <ActionButton type="button">Cadastrar produto</ActionButton>
          </Link>
        </HeaderActions>
      </PanelHeader>

      <Panel>
        <Toolbar style={{ padding: "1rem 1rem 0" }}>
          <SearchField>
            <input
              type="search"
              placeholder="Buscar por nome, código ou categoria…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-label="Buscar produto"
            />
          </SearchField>
          <FilterSelect
            value={filtro}
            onChange={(e) => setFiltro(e.target.value as FiltroVitrine)}
            aria-label="Filtrar vitrine"
          >
            <option value="todos">Todos</option>
            <option value="na-loja">Na loja</option>
            <option value="fora-loja">Fora da loja</option>
            <option value="estoque-baixo">Estoque baixo ou zerado</option>
          </FilterSelect>
        </Toolbar>

        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Código</th>
                <th>Categoria</th>
                <th>Estoque</th>
                <th>Status estoque</th>
                <th>Inventário</th>
                <th>Na loja</th>
              </tr>
            </thead>
            <tbody>
              {produtosFiltrados.length === 0 ? (
                <tr>
                  <EmptyRow colSpan={7}>
                    Nenhum produto encontrado com os filtros atuais.
                  </EmptyRow>
                </tr>
              ) : (
                produtosFiltrados.map((produto) => {
                  const status = getProdutoEstoqueStatus(produto);
                  const qtd = parseQuantidade(produto.quantidade);
                  const desabilitarLoja = !produto.ativo;

                  return (
                    <tr key={produto.id}>
                      <td>
                        <ProductCell>
                          <ProductIcon>
                            <Icon name="tag-fill" size={16} color="#fff" />
                          </ProductIcon>
                          <div>
                            <ProductName>{produto.produto}</ProductName>
                            <ProductMeta>{produto.valor}</ProductMeta>
                          </div>
                        </ProductCell>
                      </td>
                      <td>{produto.codigo}</td>
                      <td>{produto.categoria}</td>
                      <td>{qtd} un.</td>
                      <td>
                        <EstoqueBadge $status={status}>
                          {estoqueStatusLabels[status]}
                        </EstoqueBadge>
                      </td>
                      <td>{produto.ativo ? "Ativo" : "Inativo"}</td>
                      <td>
                        <LojaToggle
                          type="button"
                          $visivel={produto.visivelLoja}
                          disabled={desabilitarLoja}
                          onClick={() => toggleVisivelLoja(produto.id)}
                          title={
                            desabilitarLoja
                              ? "Ative o produto no inventário antes de exibir na loja"
                              : produto.visivelLoja
                                ? "Clique para ocultar na loja"
                                : "Clique para exibir na loja"
                          }
                          aria-pressed={produto.visivelLoja}
                          aria-label={`${produto.visivelLoja ? "Ocultar" : "Exibir"} ${produto.produto} na loja`}
                        >
                          {produto.visivelLoja ? "Na loja" : "Oculto"}
                        </LojaToggle>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </TableWrap>
      </Panel>
    </Page>
  );
}
