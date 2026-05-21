import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@components/atoms/Icon";
import { adminRoutes } from "@/config/adminMenu";
import { useFornecedores } from "@/contexts/FornecedoresContext";
import { produtoInicial, useProdutos } from "@/contexts/ProdutosContext";
import type { Produto } from "@/types/produto";
import { exportReport } from "@/utils/exportReports";
import { importCatalogSpreadsheet } from "@/utils/importCatalogSpreadsheet";
import {
  ActionButton,
  CheckboxField,
  CloseButton,
  DangerText,
  Dropzone,
  Field,
  FieldGroupTitle,
  FileName,
  FormActions,
  FormGrid,
  HeaderActions,
  IconButton,
  InventoryCard,
  InventoryHeader,
  InventoryTitle,
  Page,
  PageButton,
  Pagination,
  ProgressBar,
  ProgressFill,
  ProductCell,
  ProductDescription,
  ProductIcon,
  ProductName,
  ProductsTable,
  RowActions,
  SectionDivider,
  SelectField,
  StatusBadge,
  SummaryCard,
  SummaryGrid,
  SummaryIcon,
  SummaryInfo,
  SummaryLabel,
  SummaryValue,
  TableWrap,
  TextAreaField,
  UploadHint,
  UploadModal,
  ModalBackdrop,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ProductModal,
} from "./ProdutosPage.styles";

type ModalAtivo = "importar" | "produto" | null;

export function ProdutosPage() {
  const { produtos, setProdutos, toggleVisivelLoja } = useProdutos();
  const { fornecedores, setFornecedores } = useFornecedores();
  const [modalAtivo, setModalAtivo] = useState<ModalAtivo>(null);
  const [produtoEditandoId, setProdutoEditandoId] = useState<string | null>(null);
  const [produtoForm, setProdutoForm] = useState(produtoInicial);
  const [arquivoImportacao, setArquivoImportacao] = useState("");
  const [progressoImportacao, setProgressoImportacao] = useState(0);
  const [resultadoImportacao, setResultadoImportacao] = useState("");
  const produtosAtivos = produtos.filter((produto) => produto.ativo).length;
  const produtosInativos = produtos.length - produtosAtivos;
  const produtosForaEstoque = produtos.filter(
    (produto) => Number(produto.quantidade.replace(",", ".")) <= 0,
  ).length;
  const resumoProdutos = [
    {
      label: "Total de produtos",
      value: produtos.length.toString(),
      icon: "box-seam",
      color: "#2563eb",
      bg: "#dbeafe",
    },
    {
      label: "Produtos ativos",
      value: produtosAtivos.toString(),
      icon: "check-circle-fill",
      color: "#16a34a",
      bg: "#dcfce7",
    },
    {
      label: "Produtos inativos",
      value: produtosInativos.toString(),
      icon: "x-circle-fill",
      color: "#dc2626",
      bg: "#fee2e2",
    },
    {
      label: "Fora de estoque",
      value: produtosForaEstoque.toString(),
      icon: "exclamation-triangle-fill",
      color: "#f59e0b",
      bg: "#fef3c7",
    },
  ];

  const fecharModal = () => {
    setModalAtivo(null);
    setProdutoEditandoId(null);
    setArquivoImportacao("");
    setProgressoImportacao(0);
    setResultadoImportacao("");
    setProdutoForm(produtoInicial);
  };

  const abrirNovoProduto = () => {
    setProdutoForm({
      ...produtoInicial,
      id: `prd-${String(produtos.length + 1).padStart(3, "0")}`,
      codigo: `PRD-${String(produtos.length + 1).padStart(3, "0")}`,
    });
    setProdutoEditandoId(null);
    setModalAtivo("produto");
  };

  const abrirEdicaoProduto = (produto: Produto) => {
    setProdutoForm(produto);
    setProdutoEditandoId(produto.id);
    setModalAtivo("produto");
  };

  const atualizarCampo = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setProdutoForm((atual) => ({ ...atual, [name]: value }));
  };

  const atualizarStatus = (event: ChangeEvent<HTMLInputElement>) => {
    setProdutoForm((atual) => ({ ...atual, ativo: event.target.checked }));
  };

  const alternarStatusProduto = (produtoId: string) => {
    setProdutos((atuais) =>
      atuais.map((produto) =>
        produto.id === produtoId
          ? { ...produto, ativo: !produto.ativo }
          : produto,
      ),
    );
  };

  const selecionarArquivo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setArquivoImportacao(file.name);
    setProgressoImportacao(25);
    setResultadoImportacao("Lendo planilha e identificando produtos/fornecedores...");

    try {
      const result = await importCatalogSpreadsheet(file, {
        produtosAtuais: produtos,
        fornecedoresAtuais: fornecedores,
      });

      setProdutos(result.produtos);
      setFornecedores(result.fornecedores);
      setProgressoImportacao(100);
      setResultadoImportacao(
        `Importação concluída: ${result.produtosCriados} produto(s), ${result.fornecedoresCriados} fornecedor(es). Linhas ignoradas: ${result.linhasIgnoradas}.`,
      );
    } catch {
      setProgressoImportacao(0);
      setResultadoImportacao(
        "Não foi possível importar a planilha. Verifique se o arquivo está em CSV, XLS ou XLSX e se possui cabeçalhos.",
      );
    }
  };

  const salvarProduto = () => {
    if (produtoEditandoId) {
      setProdutos((atuais) =>
        atuais.map((produto) =>
          produto.id === produtoEditandoId ? produtoForm : produto,
        ),
      );
    } else {
      setProdutos((atuais) => [produtoForm, ...atuais]);
    }

    fecharModal();
  };

  const exportarProdutos = () => {
    exportReport({
      title: "Relatório de produtos",
      fileName: "relatorio-produtos-jb-motos",
      columns: [
        "Produto",
        "Código",
        "Descrição",
        "Fornecedor",
        "Categoria",
        "Valor venda",
        "Preço custo",
        "Quantidade",
        "Quantidade mínima",
        "Código de barras",
        "Localização",
        "Peso",
        "Dimensões",
        "Validade",
        "Status",
      ],
      rows: produtos.map((produto) => [
        produto.produto,
        produto.codigo,
        produto.descricao,
        produto.fornecedor,
        produto.categoria,
        produto.valor,
        produto.precoCusto,
        produto.quantidade,
        produto.quantidadeMinima,
        produto.codigoBarras,
        produto.localizacao,
        produto.peso,
        produto.dimensoes,
        produto.validade,
        produto.ativo ? "Ativo" : "Inativo",
      ]),
    });
  };

  return (
    <Page>
      <SummaryGrid>
        {resumoProdutos.map((item) => (
          <SummaryCard key={item.label}>
            <SummaryInfo>
              <SummaryLabel>{item.label}</SummaryLabel>
              <SummaryValue>{item.value}</SummaryValue>
            </SummaryInfo>
            <SummaryIcon $color={item.color} $bg={item.bg}>
              <Icon name={item.icon} size={21} color={item.color} />
            </SummaryIcon>
          </SummaryCard>
        ))}
      </SummaryGrid>

      <InventoryHeader>
        <InventoryTitle>
          <h1>Inventário de produtos</h1>
          <p>
            Cadastre e edite peças no sistema. Para exibir na loja, use{" "}
            <Link to={adminRoutes.cadastroAtendimento}>Cadastros → Atendimento</Link>.
          </p>
        </InventoryTitle>

        <HeaderActions>
          <ActionButton type="button" onClick={() => setModalAtivo("importar")}>
            <Icon name="file-earmark-arrow-down" size={14} color="#fff" />
            Importar
          </ActionButton>
          <ActionButton type="button" onClick={exportarProdutos}>
            <Icon name="file-earmark-arrow-up" size={14} color="#fff" />
            Exportar
          </ActionButton>
          <ActionButton type="button" onClick={abrirNovoProduto}>
            <Icon name="plus-lg" size={14} color="#fff" />
            Adicionar produto
          </ActionButton>
        </HeaderActions>
      </InventoryHeader>

      <InventoryCard>
        <TableWrap>
          <ProductsTable>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Código</th>
                <th>Descrição</th>
                <th>Fornecedor</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Na loja</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td>
                    <ProductCell>
                      <ProductIcon>
                        <Icon name="box-seam-fill" size={18} color="#fff" />
                      </ProductIcon>
                      <ProductName>{produto.produto}</ProductName>
                    </ProductCell>
                  </td>
                  <td>{produto.codigo}</td>
                  <td>
                    <ProductDescription>{produto.descricao}</ProductDescription>
                  </td>
                  <td>{produto.fornecedor}</td>
                  <td>{produto.categoria}</td>
                  <td>{produto.valor}</td>
                  <td>
                    <StatusBadge
                      type="button"
                      $active={produto.ativo}
                      onClick={() => alternarStatusProduto(produto.id)}
                      aria-label={`Alterar status de ${produto.produto}`}
                      title="Ativo no inventário (não altera a vitrine da loja)"
                    >
                      {produto.ativo ? "Ativo" : "Inativo"}
                    </StatusBadge>
                  </td>
                  <td>
                    <StatusBadge
                      type="button"
                      $active={produto.visivelLoja}
                      onClick={() => toggleVisivelLoja(produto.id)}
                      title="Exibir ou ocultar na loja e no balcão do atendente"
                    >
                      {produto.visivelLoja ? "Na loja" : "Oculto"}
                    </StatusBadge>
                  </td>
                  <td>
                    <RowActions>
                      <IconButton
                        type="button"
                        aria-label="Editar produto"
                        onClick={() => abrirEdicaoProduto(produto)}
                      >
                        <Icon name="pencil-square" size={16} />
                      </IconButton>
                      <IconButton type="button" aria-label="Excluir produto">
                        <Icon name="trash-fill" size={16} />
                      </IconButton>
                    </RowActions>
                  </td>
                </tr>
              ))}
            </tbody>
          </ProductsTable>
        </TableWrap>

        <Pagination aria-label="Paginação de produtos">
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
      </InventoryCard>

      {modalAtivo && (
        <ModalBackdrop>
          {modalAtivo === "importar" && (
            <UploadModal role="dialog" aria-modal="true">
              <ModalHeader>
                <h2>Importar planilha - Produtos</h2>
                <CloseButton type="button" onClick={fecharModal}>
                  <Icon name="x-lg" size={13} color="#fff" />
                </CloseButton>
              </ModalHeader>

              <ModalBody>
                <Dropzone>
                  <input
                    id="arquivo-produtos"
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={selecionarArquivo}
                  />
                  <Icon name="file-earmark-spreadsheet-fill" size={28} />
                  {arquivoImportacao ? (
                    <>
                      <FileName>{arquivoImportacao}</FileName>
                      <ProgressBar>
                        <ProgressFill
                          style={{ width: `${progressoImportacao}%` }}
                        />
                      </ProgressBar>
                      <UploadHint>{progressoImportacao}%</UploadHint>
                      {resultadoImportacao && (
                        <UploadHint>{resultadoImportacao}</UploadHint>
                      )}
                    </>
                  ) : (
                    <UploadHint>
                      Arraste e solte aqui
                      <span>ou</span>
                      <strong>Abrir arquivos</strong>
                    </UploadHint>
                  )}
                </Dropzone>
              </ModalBody>

              <ModalFooter>
                <ActionButton
                  type="button"
                  disabled={!arquivoImportacao}
                  onClick={fecharModal}
                >
                  Concluir
                </ActionButton>
              </ModalFooter>
            </UploadModal>
          )}

          {modalAtivo === "produto" && (
            <ProductModal role="dialog" aria-modal="true">
              <ModalHeader>
                <h2>
                  {produtoEditandoId
                    ? "Editar produto"
                    : "Adicionar novo produto"}
                </h2>
                <CloseButton type="button" onClick={fecharModal}>
                  <Icon name="x-lg" size={13} color="#fff" />
                </CloseButton>
              </ModalHeader>

              <ModalBody>
                <FormGrid>
                  <Field className="span-2">
                    <label>Imagem do produto</label>
                    <Dropzone $compact>
                      <input type="file" accept=".png,.jpg,.jpeg,.webp" />
                      <Icon name="image-fill" size={26} />
                      <UploadHint>
                        Enviar uma imagem ou arraste e solte
                        <span>PNG, JPG ou WebP</span>
                      </UploadHint>
                    </Dropzone>
                  </Field>

                  <Field>
                    <label>Categoria *</label>
                    <SelectField
                      name="categoria"
                      value={produtoForm.categoria}
                      onChange={atualizarCampo}
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="Lubrificantes">Lubrificantes</option>
                      <option value="Freios">Freios</option>
                      <option value="Pneus">Pneus</option>
                      <option value="Acessórios">Acessórios</option>
                      <option value="Transmissão">Transmissão</option>
                      <option value="Elétrica">Elétrica</option>
                      <option value="Motor">Motor</option>
                    </SelectField>
                  </Field>

                  <Field>
                    <label>Fornecedor</label>
                    <input
                      name="fornecedor"
                      value={produtoForm.fornecedor}
                      onChange={atualizarCampo}
                      placeholder="Ex.: Distribuidora Alfa"
                    />
                  </Field>

                  <Field className="span-2">
                    <label>Nome do produto *</label>
                    <input
                      name="produto"
                      value={produtoForm.produto}
                      onChange={atualizarCampo}
                      placeholder="Ex.: Óleo Motor 10W30"
                    />
                  </Field>

                  <Field>
                    <label>Preço de custo *</label>
                    <input
                      name="precoCusto"
                      value={produtoForm.precoCusto}
                      onChange={atualizarCampo}
                      placeholder="R$ 0,00"
                    />
                  </Field>

                  <Field>
                    <label>Preço de venda *</label>
                    <input
                      name="valor"
                      value={produtoForm.valor}
                      onChange={atualizarCampo}
                      placeholder="R$ 0,00"
                    />
                  </Field>

                  <Field className="span-2">
                    <label>Código do produto *</label>
                    <input
                      name="codigo"
                      value={produtoForm.codigo}
                      onChange={atualizarCampo}
                      placeholder="Ex.: PRD-001"
                    />
                  </Field>

                  <Field>
                    <label>Quantidade</label>
                    <input
                      name="quantidade"
                      value={produtoForm.quantidade}
                      onChange={atualizarCampo}
                      placeholder="0"
                    />
                  </Field>

                  <Field>
                    <label>Quantidade mínima</label>
                    <input
                      name="quantidadeMinima"
                      value={produtoForm.quantidadeMinima}
                      onChange={atualizarCampo}
                      placeholder="0"
                    />
                  </Field>

                  <Field className="span-2">
                    <label>Descrição</label>
                    <TextAreaField
                      name="descricao"
                      value={produtoForm.descricao}
                      onChange={atualizarCampo}
                      placeholder="Descreva detalhes sobre o produto"
                    />
                  </Field>

                  <Field>
                    <label>Código de barras</label>
                    <input
                      name="codigoBarras"
                      value={produtoForm.codigoBarras}
                      onChange={atualizarCampo}
                      placeholder="Digite ou escaneie"
                    />
                  </Field>

                  <Field>
                    <label>Localização no estoque</label>
                    <input
                      name="localizacao"
                      value={produtoForm.localizacao}
                      onChange={atualizarCampo}
                      placeholder="Ex.: Prateleira A3"
                    />
                  </Field>

                  <CheckboxField>
                    <input
                      id="produto-ativo"
                      type="checkbox"
                      checked={produtoForm.ativo}
                      onChange={atualizarStatus}
                    />
                    <label htmlFor="produto-ativo">
                      Ativo no inventário (vitrine: coluna Na loja)
                    </label>
                  </CheckboxField>
                </FormGrid>

                <SectionDivider />

                <FieldGroupTitle>
                  <Icon name="info-circle-fill" size={16} />
                  Inventário de produtos
                </FieldGroupTitle>

                <FormGrid>
                  <Field>
                    <label>Peso (kg)</label>
                    <input
                      name="peso"
                      value={produtoForm.peso}
                      onChange={atualizarCampo}
                      placeholder="0,00"
                    />
                  </Field>

                  <Field>
                    <label>Dimensões (cm)</label>
                    <input
                      name="dimensoes"
                      value={produtoForm.dimensoes}
                      onChange={atualizarCampo}
                      placeholder="L x A x C"
                    />
                  </Field>

                  <Field>
                    <label>Data de validade</label>
                    <input
                      name="validade"
                      type="date"
                      value={produtoForm.validade}
                      onChange={atualizarCampo}
                    />
                  </Field>
                </FormGrid>

                <DangerText>
                  Todos os campos ficam editáveis para cadastro, nova versão ou
                  atualização do produto.
                </DangerText>
              </ModalBody>

              <FormActions>
                <IconButton type="button" onClick={fecharModal}>
                  <Icon name="x-lg" size={13} />
                  Cancelar
                </IconButton>
                <ActionButton type="button" onClick={salvarProduto}>
                  <Icon name="floppy-fill" size={14} color="#fff" />
                  Salvar produto
                </ActionButton>
              </FormActions>
            </ProductModal>
          )}
        </ModalBackdrop>
      )}
    </Page>
  );
}
