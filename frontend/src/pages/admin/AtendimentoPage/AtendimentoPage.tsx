import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { adminRoutes } from "@/config/adminMenu";
import { estoqueSaidasMock } from "@/data/mockEstoqueSaidas";
import { CodigoFuncionarioModal } from "@components/molecules/CodigoFuncionarioModal";
import { useAtendimento, type NovaOrdemInput } from "@/contexts/AtendimentoContext";
import { useSessao } from "@/contexts/SessaoContext";
import type { Funcionario } from "@/types/funcionario";
import { formatarNomeFuncionario } from "@/utils/formatFuncionarioRegistro";
import { useProdutos } from "@/contexts/ProdutosContext";
import type { ClienteLoja } from "@/types/atendimento";
import type { Produto } from "@/types/produto";
import {
  buildCatalogoAtendimento,
  filtrarCatalogoPorBusca,
  type ItemCatalogoAtendimento,
} from "@/utils/atendimentoCatalogo";
import {
  estoqueStatusLabels,
  getProdutoEstoqueStatus,
  parseQuantidade,
} from "@/utils/produtoEstoque";
import {
  ClienteCard,
  ClientePicker,
  ClientePickerHead,
  EmptyCatalog,
  EstoqueTag,
  Field,
  FilterChip,
  FilterRow,
  FormDivider,
  FormTitle,
  IndisponivelHint,
  InfoBanner,
  Layout,
  OutlineBtn,
  Page,
  PageHeader,
  Panel,
  PanelHead,
  ProductCard,
  ProductGrid,
  ProductMeta,
  ProductTitle,
  ResultItem,
  ResultList,
  SaidaItem,
  SaidasList,
  SaidasPanel,
  SaidasTitle,
  SearchInput,
  SectionBlock,
  SectionTitle,
  SideBody,
  SidePanel,
  SubmitBtn,
  SubmitHint,
  Toast,
} from "./AtendimentoPage.styles";

type FiltroCatalogo = "todos" | "disponiveis" | "indisponiveis";

function renderProdutoCard(
  item: ItemCatalogoAtendimento,
  produtoSelecionado: Produto | null,
  onSelect: (produto: Produto) => void,
) {
  const { produto, statusEstoque, disponivelNaLoja, motivoIndisponivel } = item;
  const qtd = parseQuantidade(produto.quantidade);
  const selected = produtoSelecionado?.id === produto.id;

  return (
    <ProductCard
      key={produto.id}
      type="button"
      $selected={selected}
      $unavailable={!disponivelNaLoja}
      onClick={() => onSelect(produto)}
    >
      <ProductTitle>{produto.produto}</ProductTitle>
      <ProductMeta>
        {produto.codigo} · {produto.valor}
      </ProductMeta>
      <ProductMeta>
        {qtd} em estoque
        {!produto.visivelLoja ? " · fora da vitrine" : ""}
      </ProductMeta>
      <EstoqueTag $status={statusEstoque}>
        {estoqueStatusLabels[statusEstoque]}
      </EstoqueTag>
      {!disponivelNaLoja && motivoIndisponivel && (
        <IndisponivelHint>{motivoIndisponivel}</IndisponivelHint>
      )}
    </ProductCard>
  );
}

export function AtendimentoPage() {
  const { produtos } = useProdutos();
  const { podePularCodigoFuncionario, nomeRegistroSistema } = useSessao();
  const { clientes, buscarClientes, cadastrarCliente, criarOrdemServico } =
    useAtendimento();

  const [buscaProduto, setBuscaProduto] = useState("");
  const [filtroCatalogo, setFiltroCatalogo] =
    useState<FiltroCatalogo>("todos");
  const [buscaCliente, setBuscaCliente] = useState("");
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteLoja | null>(
    null,
  );
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null,
  );
  const [servicoNaMoto, setServicoNaMoto] = useState("");
  const [valorServico, setValorServico] = useState("");
  const [observacao, setObservacao] = useState("");
  const [modoCadastro, setModoCadastro] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [listaClientesAberta, setListaClientesAberta] = useState(true);
  const [modalCodigoAtendente, setModalCodigoAtendente] = useState(false);
  const [ordemPendente, setOrdemPendente] = useState<NovaOrdemInput | null>(
    null,
  );

  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    email: "",
    telefone: "",
    motoMarca: "",
    motoModelo: "",
  });

  const catalogo = useMemo(
    () => buildCatalogoAtendimento(produtos, estoqueSaidasMock),
    [produtos],
  );

  const listaFiltrada = useMemo(() => {
    let base: ItemCatalogoAtendimento[];
    switch (filtroCatalogo) {
      case "disponiveis":
        base = catalogo.disponiveis;
        break;
      case "indisponiveis":
        base = catalogo.indisponiveis;
        break;
      default:
        base = catalogo.todos;
    }
    return filtrarCatalogoPorBusca(base, buscaProduto);
  }, [catalogo, filtroCatalogo, buscaProduto]);

  const disponiveisFiltrados = useMemo(
    () =>
      filtrarCatalogoPorBusca(
        filtroCatalogo === "indisponiveis" ? [] : catalogo.disponiveis,
        buscaProduto,
      ),
    [catalogo.disponiveis, buscaProduto, filtroCatalogo],
  );

  const indisponiveisFiltrados = useMemo(
    () =>
      filtrarCatalogoPorBusca(
        filtroCatalogo === "disponiveis" ? [] : catalogo.indisponiveis,
        buscaProduto,
      ),
    [catalogo.indisponiveis, buscaProduto, filtroCatalogo],
  );

  const itemSelecionado = useMemo(() => {
    if (!produtoSelecionado) return null;
    return catalogo.todos.find((i) => i.produto.id === produtoSelecionado.id);
  }, [catalogo.todos, produtoSelecionado]);

  const resultadosCliente = useMemo(
    () =>
      buscarClientes(
        buscaCliente,
        listaClientesAberta && !buscaCliente.trim(),
      ),
    [buscaCliente, buscarClientes, listaClientesAberta],
  );

  const selecionarCliente = (c: ClienteLoja) => {
    setClienteSelecionado(c);
    setBuscaCliente(c.nome);
    setListaClientesAberta(false);
  };

  const tentarSelecionarPorNome = () => {
    const termo = buscaCliente.trim().toLowerCase();
    if (!termo || clienteSelecionado) return;
    const exato = clientes.find((c) => c.nome.toLowerCase() === termo);
    if (exato) {
      selecionarCliente(exato);
      return;
    }
    if (resultadosCliente.length === 1) {
      selecionarCliente(resultadosCliente[0]);
    }
  };

  const requisitosPendentes = useMemo(() => {
    const faltando: string[] = [];
    if (!clienteSelecionado) {
      faltando.push(
        "Clique em um cliente na lista (ou busque e selecione pelo nome)",
      );
    }
    if (!servicoNaMoto.trim()) {
      faltando.push('Preencha "Serviço a realizar na moto"');
    }
    return faltando;
  }, [clienteSelecionado, servicoNaMoto]);

  const podeEnviar = requisitosPendentes.length === 0;

  useEffect(() => {
    if (!produtoSelecionado) return;
    const moto =
      clienteSelecionado &&
      `${clienteSelecionado.motoMarca} ${clienteSelecionado.motoModelo}`.trim();
    setValorServico(produtoSelecionado.valor);
    setServicoNaMoto((atual) => {
      if (atual.trim()) return atual;
      return moto
        ? `${produtoSelecionado.produto} na ${moto}`
        : `Instalação / serviço: ${produtoSelecionado.produto}`;
    });
  }, [produtoSelecionado, clienteSelecionado]);

  const enviarParaMecanico = (event: FormEvent) => {
    event.preventDefault();
    setToast(null);

    if (!clienteSelecionado) {
      setToast({ type: "error", message: "Selecione ou cadastre um cliente." });
      return;
    }

    if (!servicoNaMoto.trim()) {
      setToast({
        type: "error",
        message: "Descreva o serviço que será feito na moto.",
      });
      return;
    }

    const avisos: string[] = [];
    let descricao = servicoNaMoto.trim();
    let estoque: number | undefined;
    let obsMecanico = observacao.trim();

    if (produtoSelecionado) {
      estoque = parseQuantidade(produtoSelecionado.quantidade);
      const statusEstoque = getProdutoEstoqueStatus(produtoSelecionado);
      const indisponivel = !itemSelecionado?.disponivelNaLoja;

      if (indisponivel && itemSelecionado?.motivoIndisponivel) {
        avisos.push(itemSelecionado.motivoIndisponivel);
      }
      if (statusEstoque === "zerado") {
        avisos.push("Sem estoque — aguardar entrada ou compra");
      }
      if (!produtoSelecionado.visivelLoja) {
        avisos.push("Produto fora da vitrine da loja");
      }

      descricao = [
        `Instalação / serviço: ${produtoSelecionado.produto}`,
        `Código ${produtoSelecionado.codigo}`,
        servicoNaMoto.trim(),
        observacao.trim() ? `Obs.: ${observacao.trim()}` : null,
      ]
        .filter(Boolean)
        .join(" · ");

      const obsEstoque =
        statusEstoque === "baixo" || statusEstoque === "critico"
          ? `Estoque ${estoqueStatusLabels[statusEstoque].toLowerCase()} no balcão.`
          : null;
      obsMecanico = [...avisos, obsEstoque, observacao.trim()]
        .filter(Boolean)
        .join(" ");
    } else if (observacao.trim()) {
      descricao = `${servicoNaMoto.trim()} · Obs.: ${observacao.trim()}`;
    }

    const ordem: NovaOrdemInput = {
      clienteId: clienteSelecionado.id,
      clienteNome: clienteSelecionado.nome,
      motoMarca: clienteSelecionado.motoMarca,
      motoModelo: clienteSelecionado.motoModelo,
      produtoId: produtoSelecionado?.id,
      produtoCodigo: produtoSelecionado?.codigo,
      produtoNome: produtoSelecionado?.produto,
      tipo: "servico",
      servicoNaMoto: servicoNaMoto.trim(),
      descricao,
      observacao: obsMecanico || undefined,
      estoqueNoMomento: estoque,
      valorServico:
        valorServico.trim() || produtoSelecionado?.valor || undefined,
      origem: "balcao_atendente",
    };

    setOrdemPendente(ordem);
    setModalCodigoAtendente(true);
  };

  const limparFormularioEnvio = () => {
    setProdutoSelecionado(null);
    setServicoNaMoto("");
    setValorServico("");
    setObservacao("");
  };

  const pularCodigoComoAdmin = () => {
    if (!ordemPendente) return;
    criarOrdemServico({
      ...ordemPendente,
      atendenteNome: nomeRegistroSistema,
      atendente: nomeRegistroSistema,
    });
    setModalCodigoAtendente(false);
    setOrdemPendente(null);
    const indisponivel =
      ordemPendente.observacao?.includes("indisponível") ||
      ordemPendente.observacao?.includes("Sem estoque");
    setToast({
      type: "success",
      message: indisponivel
        ? "OS enviada pelo administrador. Peça indisponível — veja em Requisições."
        : "OS em espera (administrador). Mecânico conclui em Requisições.",
    });
    limparFormularioEnvio();
  };

  const confirmarAtendente = (funcionario: Funcionario) => {
    if (!ordemPendente) return;
    const nome = formatarNomeFuncionario(
      funcionario.nome,
      funcionario.sobrenome,
    );
    criarOrdemServico({
      ...ordemPendente,
      atendenteCodigo: funcionario.codigoServico,
      atendenteNome: nome,
      atendente: nome,
    });
    setModalCodigoAtendente(false);
    setOrdemPendente(null);
    const indisponivel =
      ordemPendente.observacao?.includes("indisponível") ||
      ordemPendente.observacao?.includes("Sem estoque");
    setToast({
      type: "success",
      message: indisponivel
        ? `OS enviada (ID atendente ${funcionario.codigoServico}). Peça indisponível — veja em Requisições.`
        : `OS em espera (atendente ID ${funcionario.codigoServico}). Mecânico conclui em Requisições.`,
    });
    limparFormularioEnvio();
  };

  const salvarNovoCliente = (event: FormEvent) => {
    event.preventDefault();
    if (!novoCliente.nome.trim() || !novoCliente.telefone.trim()) {
      setToast({
        type: "error",
        message: "Nome e telefone são obrigatórios para cadastrar.",
      });
      return;
    }

    const criado = cadastrarCliente({
      nome: novoCliente.nome.trim(),
      email: novoCliente.email.trim(),
      telefone: novoCliente.telefone.trim(),
      motoMarca: novoCliente.motoMarca.trim() || "—",
      motoModelo: novoCliente.motoModelo.trim() || "—",
    });

    selecionarCliente(criado);
    setModoCadastro(false);
    setToast({
      type: "success",
      message: `Cliente ${criado.nome} cadastrado na loja.`,
    });
  };

  const mostrarSecoesSeparadas =
    filtroCatalogo === "todos" && !buscaProduto.trim();

  return (
    <Page>
      <PageHeader>
        <h1>Atendimento no balcão</h1>
        <p>
          Catálogo completo: o que está na loja, o que saiu do estoque e o que
          está fora da vitrine — tudo para o atendente orientar o cliente sem
          ir em Estoque.
        </p>
      </PageHeader>

      <InfoBanner>
        <strong>Disponíveis</strong> = na vitrine e com estoque.{" "}
        <strong>Indisponíveis</strong> = sem estoque, fora da loja ou com saída
        recente (Estoque → Saída). Cadastro em{" "}
        <Link to={adminRoutes.produtos}>Produtos</Link> · fila em{" "}
        <Link to={adminRoutes.requisicoes}>Requisições</Link>.
      </InfoBanner>

      {toast && <Toast $type={toast.type}>{toast.message}</Toast>}

      <Layout>
        <Panel>
          <PanelHead>
            <div>
              <h2>Catálogo e estoque</h2>
              <span>
                {catalogo.disponiveis.length} na loja ·{" "}
                {catalogo.indisponiveis.length} indisponível(is)
              </span>
            </div>
            <SearchInput
              type="search"
              placeholder="Buscar peça…"
              value={buscaProduto}
              onChange={(e) => setBuscaProduto(e.target.value)}
              style={{ maxWidth: 220 }}
            />
          </PanelHead>

          <FilterRow>
            <FilterChip
              type="button"
              $active={filtroCatalogo === "todos"}
              onClick={() => setFiltroCatalogo("todos")}
            >
              Todos ({catalogo.todos.length})
            </FilterChip>
            <FilterChip
              type="button"
              $active={filtroCatalogo === "disponiveis"}
              onClick={() => setFiltroCatalogo("disponiveis")}
            >
              Na loja ({catalogo.disponiveis.length})
            </FilterChip>
            <FilterChip
              type="button"
              $active={filtroCatalogo === "indisponiveis"}
              onClick={() => setFiltroCatalogo("indisponiveis")}
            >
              Indisponíveis ({catalogo.indisponiveis.length})
            </FilterChip>
          </FilterRow>

          <SaidasPanel>
            <SaidasTitle>Últimas saídas do estoque</SaidasTitle>
            <SaidasList>
              {estoqueSaidasMock.slice(0, 5).map((s) => (
                <SaidaItem key={s.id}>
                  <strong>{s.produto}</strong> ({s.codigo}) — {s.quantidade}{" "}
                  un. · {s.data} · {s.motivo}
                </SaidaItem>
              ))}
            </SaidasList>
          </SaidasPanel>

          {listaFiltrada.length === 0 ? (
            <EmptyCatalog>
              Nenhum produto neste filtro. Tente outra busca ou cadastre em
              Produtos.
            </EmptyCatalog>
          ) : mostrarSecoesSeparadas ? (
            <SectionBlock>
              <SectionTitle>
                Disponíveis na loja agora
                <span>{disponiveisFiltrados.length}</span>
              </SectionTitle>
              {disponiveisFiltrados.length === 0 ? (
                <EmptyCatalog>Nenhum item disponível no momento.</EmptyCatalog>
              ) : (
                <ProductGrid>
                  {disponiveisFiltrados.map((item) =>
                    renderProdutoCard(item, produtoSelecionado, setProdutoSelecionado),
                  )}
                </ProductGrid>
              )}

              <SectionTitle>
                Indisponíveis no momento
                <span>{indisponiveisFiltrados.length}</span>
              </SectionTitle>
              {indisponiveisFiltrados.length === 0 ? (
                <EmptyCatalog>Todos os itens ativos estão na vitrine.</EmptyCatalog>
              ) : (
                <ProductGrid>
                  {indisponiveisFiltrados.map((item) =>
                    renderProdutoCard(item, produtoSelecionado, setProdutoSelecionado),
                  )}
                </ProductGrid>
              )}
            </SectionBlock>
          ) : (
            <SectionBlock>
              <ProductGrid>
                {listaFiltrada.map((item) =>
                  renderProdutoCard(item, produtoSelecionado, setProdutoSelecionado),
                )}
              </ProductGrid>
            </SectionBlock>
          )}
        </Panel>

        <SidePanel as="form" onSubmit={enviarParaMecanico}>
          <PanelHead>
            <h2>Cliente e ordem de serviço</h2>
          </PanelHead>
          <SideBody>
            <Field>
              Buscar cliente (nome, telefone ou moto)
              <SearchInput
                type="search"
                value={buscaCliente}
                onFocus={() => setListaClientesAberta(true)}
                onBlur={() => {
                  window.setTimeout(() => tentarSelecionarPorNome(), 150);
                }}
                onChange={(e) => {
                  const valor = e.target.value;
                  setBuscaCliente(valor);
                  setListaClientesAberta(true);
                  if (
                    clienteSelecionado &&
                    valor.trim() !== clienteSelecionado.nome
                  ) {
                    setClienteSelecionado(null);
                  }
                }}
                placeholder="Ex.: João ou 11987…"
              />
            </Field>

            {!modoCadastro && !clienteSelecionado && (
              <>
                <OutlineBtn
                  type="button"
                  onClick={() => setListaClientesAberta((v) => !v)}
                >
                  {listaClientesAberta
                    ? "Ocultar lista de clientes"
                    : `Ver ${clientes.length} cliente(s) cadastrado(s)`}
                </OutlineBtn>

                {listaClientesAberta && resultadosCliente.length > 0 && (
                  <ClientePicker>
                    <ClientePickerHead>
                      {buscaCliente.trim()
                        ? `${resultadosCliente.length} resultado(s) — clique para selecionar`
                        : `Clientes cadastrados (${resultadosCliente.length}) — clique para selecionar`}
                    </ClientePickerHead>
                    <ResultList>
                      {resultadosCliente.map((c) => (
                        <ResultItem
                          key={c.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selecionarCliente(c)}
                        >
                          <strong>{c.nome}</strong>
                          <span>
                            {c.telefone} · {c.motoMarca} {c.motoModelo}
                          </span>
                        </ResultItem>
                      ))}
                    </ResultList>
                  </ClientePicker>
                )}

                {listaClientesAberta &&
                  buscaCliente.trim() &&
                  resultadosCliente.length === 0 && (
                    <SubmitHint>
                      Nenhum cliente com &quot;{buscaCliente.trim()}&quot;. Use
                      &quot;Cadastrar agora&quot; ou limpe a busca para ver
                      todos.
                    </SubmitHint>
                  )}
              </>
            )}

            {clienteSelecionado && (
              <ClienteCard>
                <strong>{clienteSelecionado.nome}</strong>
                <span>{clienteSelecionado.telefone}</span>
                <span>
                  {clienteSelecionado.motoMarca} {clienteSelecionado.motoModelo}
                </span>
              </ClienteCard>
            )}

            {!modoCadastro ? (
              <OutlineBtn
                type="button"
                onClick={() => {
                  setModoCadastro(true);
                  setNovoCliente((atual) => ({
                    ...atual,
                    nome: buscaCliente.trim(),
                  }));
                }}
              >
                Cliente não cadastrado? Cadastrar agora
              </OutlineBtn>
            ) : (
              <>
                <FormTitle>Novo cliente na loja</FormTitle>
                <Field>
                  Nome completo
                  <input
                    required
                    value={novoCliente.nome}
                    onChange={(e) =>
                      setNovoCliente((a) => ({ ...a, nome: e.target.value }))
                    }
                  />
                </Field>
                <Field>
                  Telefone
                  <input
                    required
                    value={novoCliente.telefone}
                    onChange={(e) =>
                      setNovoCliente((a) => ({
                        ...a,
                        telefone: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field>
                  E-mail
                  <input
                    type="email"
                    value={novoCliente.email}
                    onChange={(e) =>
                      setNovoCliente((a) => ({ ...a, email: e.target.value }))
                    }
                  />
                </Field>
                <Field>
                  Marca da moto
                  <input
                    value={novoCliente.motoMarca}
                    onChange={(e) =>
                      setNovoCliente((a) => ({
                        ...a,
                        motoMarca: e.target.value,
                      }))
                    }
                  />
                </Field>
                <Field>
                  Modelo da moto
                  <input
                    value={novoCliente.motoModelo}
                    onChange={(e) =>
                      setNovoCliente((a) => ({
                        ...a,
                        motoModelo: e.target.value,
                      }))
                    }
                  />
                </Field>
                <OutlineBtn type="button" onClick={salvarNovoCliente}>
                  Salvar cliente
                </OutlineBtn>
                <OutlineBtn
                  type="button"
                  onClick={() => setModoCadastro(false)}
                >
                  Cancelar cadastro
                </OutlineBtn>
                <FormDivider />
              </>
            )}

            {produtoSelecionado && (
              <ClienteCard>
                <strong>Peça selecionada</strong>
                <span>{produtoSelecionado.produto}</span>
                <span>
                  Estoque: {parseQuantidade(produtoSelecionado.quantidade)} un.
                </span>
                {itemSelecionado && !itemSelecionado.disponivelNaLoja && (
                  <IndisponivelHint>
                    Atenção: {itemSelecionado.motivoIndisponivel}
                  </IndisponivelHint>
                )}
              </ClienteCard>
            )}

            <Field>
              Serviço a realizar na moto *
              <textarea
                required
                value={servicoNaMoto}
                onChange={(e) => setServicoNaMoto(e.target.value)}
                placeholder="Ex.: Cliente relata barulho no motor — diagnóstico"
              />
            </Field>

            {!produtoSelecionado && (
              <SubmitHint>
                Peça do catálogo é <strong>opcional</strong> (ex.: só diagnóstico
                ou serviço sem peça). Clique em um produto à esquerda se houver
                peça envolvida.
              </SubmitHint>
            )}

            <Field>
              Valor previsto (R$)
              <SearchInput
                type="text"
                value={valorServico}
                onChange={(e) => setValorServico(e.target.value)}
                placeholder="Ex.: R$ 85,00"
              />
            </Field>

            <Field>
              Observação para o mecânico
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex.: cliente aguarda no balcão, barulho no freio…"
              />
            </Field>

            {!podeEnviar && (
              <SubmitHint>
                <strong>Para liberar o envio:</strong>
                <ul>
                  {requisitosPendentes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </SubmitHint>
            )}

            <SubmitBtn type="submit" disabled={!podeEnviar}>
              Enviar requisição (em espera)
            </SubmitBtn>
          </SideBody>
        </SidePanel>
      </Layout>

      <CodigoFuncionarioModal
        open={modalCodigoAtendente}
        titulo="Código do atendente"
        descricao={
          podePularCodigoFuncionario
            ? "Informe o código do atendente (4 a 6 dígitos) para registrar quem enviou esta ordem — útil para testes até o cadastro no banco."
            : "Informe seu código de serviço (4 a 6 dígitos) para registrar quem enviou esta ordem ao mecânico."
        }
        rotuloCampo={
          podePularCodigoFuncionario
            ? "Código do atendente"
            : "Seu código de serviço"
        }
        dicaTeste={
          podePularCodigoFuncionario
            ? "Teste: 1001 — Ana Santos · 1002 — Mariana Oliveira"
            : undefined
        }
        perfis={["atendente"]}
        permitirPularComoAdmin={podePularCodigoFuncionario}
        onPularComoAdmin={pularCodigoComoAdmin}
        onConfirm={confirmarAtendente}
        onCancel={() => {
          setModalCodigoAtendente(false);
          setOrdemPendente(null);
        }}
      />
    </Page>
  );
}
