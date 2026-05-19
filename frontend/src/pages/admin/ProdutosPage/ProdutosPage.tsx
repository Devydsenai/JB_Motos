import { useState, type ChangeEvent } from "react";
import { Icon } from "@components/atoms/Icon";
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

type ProdutoInventario = {
  id: string;
  produto: string;
  codigo: string;
  descricao: string;
  fornecedor: string;
  categoria: string;
  valor: string;
  ativo: boolean;
  precoCusto: string;
  quantidade: string;
  quantidadeMinima: string;
  codigoBarras: string;
  localizacao: string;
  peso: string;
  dimensoes: string;
  validade: string;
};

type ModalAtivo = "importar" | "exportar" | "produto" | null;

const produtoInicial: ProdutoInventario = {
  id: "",
  produto: "",
  codigo: "",
  descricao: "",
  fornecedor: "",
  categoria: "",
  valor: "",
  ativo: true,
  precoCusto: "",
  quantidade: "",
  quantidadeMinima: "",
  codigoBarras: "",
  localizacao: "",
  peso: "",
  dimensoes: "",
  validade: "",
};

const produtosMock: ProdutoInventario[] = [
  {
    id: "prd-001",
    produto: "Óleo Motor 10W30",
    codigo: "PRD-001",
    descricao: "Óleo semissintético para motos de baixa e média cilindrada",
    fornecedor: "Distribuidora Alfa",
    categoria: "Lubrificantes",
    valor: "R$48,90",
    ativo: true,
    precoCusto: "R$31,00",
    quantidade: "48",
    quantidadeMinima: "10",
    codigoBarras: "7891000100010",
    localizacao: "Prateleira A1",
    peso: "1,00",
    dimensoes: "8 x 8 x 22",
    validade: "2026-12-31",
  },
  {
    id: "prd-002",
    produto: "Pastilha de Freio",
    codigo: "PRD-002",
    descricao: "Pastilha dianteira compatível com linha Honda CG",
    fornecedor: "Moto Peças Brasil",
    categoria: "Freios",
    valor: "R$35,00",
    ativo: false,
    precoCusto: "R$21,00",
    quantidade: "5",
    quantidadeMinima: "12",
    codigoBarras: "7891000100027",
    localizacao: "Prateleira B2",
    peso: "0,35",
    dimensoes: "12 x 8 x 4",
    validade: "2027-06-20",
  },
  {
    id: "prd-003",
    produto: "Pneu Traseiro 90/90",
    codigo: "PRD-003",
    descricao: "Pneu traseiro urbano com boa aderência para uso diário",
    fornecedor: "Pneus Prime",
    categoria: "Pneus",
    valor: "R$189,90",
    ativo: true,
    precoCusto: "R$132,00",
    quantidade: "12",
    quantidadeMinima: "6",
    codigoBarras: "7891000100034",
    localizacao: "Rack P1",
    peso: "3,60",
    dimensoes: "58 x 58 x 10",
    validade: "2028-03-15",
  },
  {
    id: "prd-004",
    produto: "Capacete Pro Tork",
    codigo: "PRD-004",
    descricao: "Capacete fechado com viseira cristal e selo Inmetro",
    fornecedor: "Distribuidora Alfa",
    categoria: "Acessórios",
    valor: "R$249,90",
    ativo: true,
    precoCusto: "R$170,00",
    quantidade: "32",
    quantidadeMinima: "8",
    codigoBarras: "7891000100041",
    localizacao: "Vitrine C1",
    peso: "1,35",
    dimensoes: "35 x 28 x 28",
    validade: "2029-01-10",
  },
  {
    id: "prd-005",
    produto: "Kit Relação CG 160",
    codigo: "PRD-005",
    descricao: "Kit com coroa, pinhão e corrente para manutenção completa",
    fornecedor: "Moto Peças Brasil",
    categoria: "Transmissão",
    valor: "R$142,50",
    ativo: true,
    precoCusto: "R$98,00",
    quantidade: "18",
    quantidadeMinima: "5",
    codigoBarras: "7891000100058",
    localizacao: "Prateleira D4",
    peso: "1,80",
    dimensoes: "26 x 18 x 6",
    validade: "2028-11-12",
  },
  {
    id: "prd-006",
    produto: "Filtro de Ar",
    codigo: "PRD-006",
    descricao: "Filtro de ar para reposição em serviços preventivos",
    fornecedor: "Peças Rápidas",
    categoria: "Motor",
    valor: "R$28,90",
    ativo: false,
    precoCusto: "R$16,00",
    quantidade: "3",
    quantidadeMinima: "10",
    codigoBarras: "7891000100065",
    localizacao: "Prateleira A3",
    peso: "0,20",
    dimensoes: "14 x 10 x 5",
    validade: "2027-08-30",
  },
  {
    id: "prd-007",
    produto: "Vela de Ignição",
    codigo: "PRD-007",
    descricao: "Vela resistente para partida estável e melhor queima",
    fornecedor: "Peças Rápidas",
    categoria: "Elétrica",
    valor: "R$24,90",
    ativo: true,
    precoCusto: "R$13,50",
    quantidade: "40",
    quantidadeMinima: "15",
    codigoBarras: "7891000100072",
    localizacao: "Gaveta E2",
    peso: "0,08",
    dimensoes: "8 x 3 x 3",
    validade: "2028-05-05",
  },
  {
    id: "prd-008",
    produto: "Retrovisor Universal",
    codigo: "PRD-008",
    descricao: "Par de retrovisores para reposição no balcão e oficina",
    fornecedor: "Distribuidora Alfa",
    categoria: "Acessórios",
    valor: "R$59,90",
    ativo: true,
    precoCusto: "R$36,00",
    quantidade: "24",
    quantidadeMinima: "8",
    codigoBarras: "7891000100089",
    localizacao: "Prateleira C3",
    peso: "0,55",
    dimensoes: "28 x 16 x 8",
    validade: "2029-04-18",
  },
  {
    id: "prd-009",
    produto: "Bateria 12V",
    codigo: "PRD-009",
    descricao: "Bateria selada para motos com partida elétrica",
    fornecedor: "Energia Moto",
    categoria: "Elétrica",
    valor: "R$210,00",
    ativo: true,
    precoCusto: "R$150,00",
    quantidade: "9",
    quantidadeMinima: "4",
    codigoBarras: "7891000100096",
    localizacao: "Rack E1",
    peso: "2,40",
    dimensoes: "15 x 9 x 10",
    validade: "2026-10-22",
  },
];

export function ProdutosPage() {
  const [produtos, setProdutos] = useState(produtosMock);
  const [modalAtivo, setModalAtivo] = useState<ModalAtivo>(null);
  const [produtoEditandoId, setProdutoEditandoId] = useState<string | null>(null);
  const [produtoForm, setProdutoForm] = useState(produtoInicial);
  const [arquivoImportacao, setArquivoImportacao] = useState("");
  const [progressoImportacao, setProgressoImportacao] = useState(0);
  const [progressoExportacao, setProgressoExportacao] = useState(0);
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
    setProgressoExportacao(0);
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

  const abrirEdicaoProduto = (produto: ProdutoInventario) => {
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

  const selecionarArquivo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setArquivoImportacao(file.name);
    setProgressoImportacao(50);
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
          <p>Gerencie seus itens de estoque e níveis de inventário</p>
        </InventoryTitle>

        <HeaderActions>
          <ActionButton type="button" onClick={() => setModalAtivo("importar")}>
            <Icon name="file-earmark-arrow-down" size={14} color="#fff" />
            Importar
          </ActionButton>
          <ActionButton type="button" onClick={() => setModalAtivo("exportar")}>
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
                      title="Clique para alternar ativo/inativo"
                    >
                      {produto.ativo ? "Ativo" : "Inativo"}
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
                  onClick={() => setProgressoImportacao(100)}
                >
                  Importar
                </ActionButton>
              </ModalFooter>
            </UploadModal>
          )}

          {modalAtivo === "exportar" && (
            <UploadModal role="dialog" aria-modal="true">
              <ModalHeader>
                <h2>Exportar planilha - Produtos</h2>
                <CloseButton type="button" onClick={fecharModal}>
                  <Icon name="x-lg" size={13} color="#fff" />
                </CloseButton>
              </ModalHeader>

              <ModalBody>
                <Dropzone>
                  <Icon name="file-earmark-arrow-up-fill" size={30} />
                  <FileName>produtos-jb-motos.csv</FileName>
                  <UploadHint>
                    Exportação do inventário atual
                    <span>CSV com produtos, estoque e status</span>
                  </UploadHint>
                  {progressoExportacao > 0 && (
                    <ProgressBar>
                      <ProgressFill style={{ width: `${progressoExportacao}%` }} />
                    </ProgressBar>
                  )}
                </Dropzone>
              </ModalBody>

              <ModalFooter>
                <ActionButton
                  type="button"
                  onClick={() => setProgressoExportacao(100)}
                >
                  Exportar
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
                    <label htmlFor="produto-ativo">Produto ativo</label>
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
