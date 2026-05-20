import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import { Icon } from "@components/atoms/Icon";
import { statusFornecedorLabels } from "@/data/mockFornecedores";
import {
  fornecedorInicial,
  useFornecedores,
} from "@/contexts/FornecedoresContext";
import type { Fornecedor } from "@/types/fornecedor";
import { exportReportPdf } from "@/utils/exportReports";
import {
  ActionButton,
  BrowseButton,
  CloseButton,
  CompanyCell,
  CompanyIcon,
  CompanyId,
  CompanyName,
  Dropzone,
  Field,
  FieldGroupTitle,
  FieldRow,
  FileBrowseRow,
  FileName,
  FormActions,
  FormColumn,
  FormModal,
  FormTwoCol,
  HeaderActions,
  IconButton,
  ListCard,
  ListHeader,
  ListTitle,
  ModalBackdrop,
  ModalBody,
  ModalFooter,
  ModalHeader,
  OutlineButton,
  Page,
  PageButton,
  Pagination,
  ProgressBar,
  ProgressFill,
  RowActions,
  SectionDivider,
  SummaryCard,
  SummaryGrid,
  SummaryIcon,
  SummaryInfo,
  SummaryLabel,
  SummaryValue,
  SupplierStatusBadge,
  SuppliersTable,
  TableWrap,
  TextAreaField,
  ToggleInput,
  ToggleRow,
  UploadHint,
  UploadModal,
} from "./CadastroFornecedoresPage.styles";

type ModalAtivo = "importar" | "fornecedor" | null;

const TIPOS_FORNECEDOR = [
  "Fabricante",
  "Distribuidor",
  "Atacadista",
  "Varejista",
  "Serviços",
];

const CATEGORIAS = [
  "Construção",
  "Eletrônicos",
  "Alimentos",
  "Material de Escritório",
  "Têxtil",
  "Lubrificantes",
  "Freios",
  "Pneus",
];

export function CadastroFornecedoresPage() {
  const {
    fornecedores,
    salvarFornecedor,
    excluirFornecedor,
    alternarStatusFornecedor,
  } = useFornecedores();

  const [modalAtivo, setModalAtivo] = useState<ModalAtivo>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(fornecedorInicial);
  const [arquivoImportacao, setArquivoImportacao] = useState("");
  const [progressoImportacao, setProgressoImportacao] = useState(0);
  const [pagina, setPagina] = useState(1);

  const resumo = useMemo(() => {
    const ativos = fornecedores.filter((f) => f.status === "ativo").length;
    const inativos = fornecedores.filter((f) => f.status === "inativo").length;
    const pendentes = fornecedores.filter((f) => f.status === "pendente").length;
    return {
      total: fornecedores.length,
      ativos,
      inativos,
      pendentes,
    };
  }, [fornecedores]);

  const cardsResumo = [
    {
      label: "Total de fornecedores",
      value: resumo.total.toString(),
      icon: "truck",
      color: "#c41e1e",
      bg: "#fee2e2",
    },
    {
      label: "Fornecedores ativos",
      value: resumo.ativos.toString(),
      icon: "check-circle-fill",
      color: "#16a34a",
      bg: "#dcfce7",
    },
    {
      label: "Fornecedores inativos",
      value: resumo.inativos.toString(),
      icon: "x-circle-fill",
      color: "#dc2626",
      bg: "#fee2e2",
    },
    {
      label: "Fornecedores pendentes",
      value: resumo.pendentes.toString(),
      icon: "exclamation-triangle-fill",
      color: "#d97706",
      bg: "#fef3c7",
    },
  ];

  const fecharModal = () => {
    setModalAtivo(null);
    setEditandoId(null);
    setArquivoImportacao("");
    setProgressoImportacao(0);
    setForm(fornecedorInicial);
  };

  const abrirNovo = () => {
    const n = fornecedores.length + 1;
    setForm({
      ...fornecedorInicial,
      id: `for-${Date.now()}`,
      codigo: `FOR-${String(n).padStart(3, "0")}`,
      status: "pendente",
    });
    setEditandoId(null);
    setModalAtivo("fornecedor");
  };

  const abrirEdicao = (fornecedor: Fornecedor) => {
    setForm(fornecedor);
    setEditandoId(fornecedor.id);
    setModalAtivo("fornecedor");
  };

  const atualizarCampo = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  };

  const atualizarAtivo = (event: ChangeEvent<HTMLInputElement>) => {
    const ativo = event.target.checked;
    setForm((atual) => ({
      ...atual,
      status: ativo ? "ativo" : "inativo",
    }));
  };

  const selecionarArquivo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setArquivoImportacao(file.name);
    setProgressoImportacao(50);
  };

  const selecionarDocumento = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setForm((atual) => ({
      ...atual,
      documentoNome: file?.name ?? "",
    }));
  };

  const salvar = () => {
    if (!form.nome.trim() || !form.contato.trim() || !form.email.trim()) {
      return;
    }
    salvarFornecedor(form, editandoId);
    fecharModal();
  };

  const linhasExportacao = useCallback(
    () =>
      fornecedores.map((f) => [
        f.nome,
        f.codigo,
        f.contato,
        f.email,
        f.telefone,
        f.qtdProdutos,
        statusFornecedorLabels[f.status],
        f.tipo,
        f.categoria,
        f.cnpj,
      ]),
    [fornecedores],
  );

  const COLUNAS_EXPORT = [
    "Empresa",
    "Código",
    "Contato",
    "E-mail",
    "Telefone",
    "Produtos",
    "Status",
    "Tipo",
    "Categoria",
    "CNPJ",
  ];

  const exportarCsv = () => {
    const escape = (v: string | number) => {
      const text = String(v).replace(/"/g, '""');
      return /[",\n]/.test(text) ? `"${text}"` : text;
    };
    const csv = [
      COLUNAS_EXPORT.join(","),
      ...linhasExportacao().map((row) => row.map(escape).join(",")),
    ].join("\n");
    const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jb-motos-fornecedores-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportarPdf = () => {
    exportReportPdf({
      title: "Lista de fornecedores — JB Motos",
      fileName: `jb-motos-fornecedores-${Date.now()}`,
      columns: COLUNAS_EXPORT,
      rows: linhasExportacao(),
    });
  };

  const porPagina = 5;
  const totalPaginas = Math.max(1, Math.ceil(fornecedores.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const fornecedoresPagina = fornecedores.slice(
    (paginaAtual - 1) * porPagina,
    paginaAtual * porPagina,
  );

  return (
    <Page>
      <SummaryGrid>
        {cardsResumo.map((item) => (
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

      <ListHeader>
        <ListTitle>
          <h1>Lista de fornecedores</h1>
          <p>Gerencie seus fornecedores e relacionamento com vendedores</p>
        </ListTitle>
        <HeaderActions>
          <OutlineButton type="button" onClick={() => setModalAtivo("importar")}>
            <Icon name="file-earmark-arrow-up" size={14} />
            Importar
          </OutlineButton>
          <OutlineButton
            type="button"
            disabled={fornecedores.length === 0}
            onClick={exportarCsv}
          >
            <Icon name="filetype-csv" size={14} />
            Exportar CSV
          </OutlineButton>
          <OutlineButton
            type="button"
            disabled={fornecedores.length === 0}
            onClick={exportarPdf}
          >
            <Icon name="file-earmark-pdf" size={14} />
            Relatório PDF
          </OutlineButton>
          <ActionButton type="button" onClick={abrirNovo}>
            <Icon name="plus-lg" size={14} color="#fff" />
            Adicionar fornecedor
          </ActionButton>
        </HeaderActions>
      </ListHeader>

      <ListCard>
        <TableWrap>
          <SuppliersTable>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Contato</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Produtos</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {fornecedoresPagina.map((f) => (
                <tr key={f.id}>
                  <td>
                    <CompanyCell>
                      <CompanyIcon>
                        <Icon name="building-fill" size={18} color="#fff" />
                      </CompanyIcon>
                      <div>
                        <CompanyName>{f.nome}</CompanyName>
                        <CompanyId>ID: {f.codigo}</CompanyId>
                      </div>
                    </CompanyCell>
                  </td>
                  <td>{f.contato}</td>
                  <td>{f.email}</td>
                  <td>{f.telefone}</td>
                  <td>{f.qtdProdutos}</td>
                  <td>
                    <SupplierStatusBadge
                      type="button"
                      $status={f.status}
                      onClick={() => alternarStatusFornecedor(f.id)}
                      title="Clique para alterar status"
                    >
                      {statusFornecedorLabels[f.status]}
                    </SupplierStatusBadge>
                  </td>
                  <td>
                    <RowActions>
                      <IconButton
                        type="button"
                        aria-label="Editar"
                        onClick={() => abrirEdicao(f)}
                      >
                        <Icon name="pencil-square" size={16} />
                      </IconButton>
                      <IconButton
                        type="button"
                        aria-label="Excluir"
                        onClick={() => excluirFornecedor(f.id)}
                      >
                        <Icon name="trash-fill" size={16} />
                      </IconButton>
                    </RowActions>
                  </td>
                </tr>
              ))}
            </tbody>
          </SuppliersTable>
        </TableWrap>

        <Pagination aria-label="Paginação">
          <Icon name="chevron-left" size={12} />
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
            <PageButton
              key={n}
              type="button"
              $active={n === paginaAtual}
              onClick={() => setPagina(n)}
            >
              {n}
            </PageButton>
          ))}
          <Icon name="chevron-right" size={12} />
        </Pagination>
      </ListCard>

      {modalAtivo && (
        <ModalBackdrop onClick={fecharModal}>
          {modalAtivo === "importar" && (
            <UploadModal
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h2>Importar planilha — Fornecedores</h2>
                <CloseButton type="button" onClick={fecharModal}>
                  <Icon name="x-lg" size={13} color="#fff" />
                </CloseButton>
              </ModalHeader>
              <ModalBody>
                <Dropzone>
                  <input
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

          {modalAtivo === "fornecedor" && (
            <FormModal
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h2>
                  {editandoId ? "Editar fornecedor" : "Adicionar fornecedor"}
                </h2>
                <CloseButton type="button" onClick={fecharModal}>
                  <Icon name="x-lg" size={13} color="#fff" />
                </CloseButton>
              </ModalHeader>

              <ModalBody>
                <FormTwoCol>
                  <FormColumn>
                    <FieldGroupTitle>
                      <Icon name="info-circle-fill" size={16} />
                      Informações básicas
                    </FieldGroupTitle>
                    <Field>
                      <label>Nome do fornecedor *</label>
                      <input
                        name="nome"
                        value={form.nome}
                        onChange={atualizarCampo}
                        placeholder="Ex.: Materiais de Construção Ltda"
                      />
                    </Field>
                    <Field>
                      <label>CNPJ</label>
                      <input
                        name="cnpj"
                        value={form.cnpj}
                        onChange={atualizarCampo}
                        placeholder="00.000.000/0000-00"
                      />
                    </Field>
                    <Field>
                      <label>Tipo de fornecedor *</label>
                      <select
                        name="tipo"
                        value={form.tipo}
                        onChange={atualizarCampo}
                      >
                        <option value="">Selecione um tipo</option>
                        {TIPOS_FORNECEDOR.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field>
                      <label>Categoria de produtos</label>
                      <select
                        name="categoria"
                        value={form.categoria}
                        onChange={atualizarCampo}
                      >
                        <option value="">Selecione uma categoria</option>
                        {CATEGORIAS.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field>
                      <label>Fornecedor desde</label>
                      <input
                        name="fornecedorDesde"
                        type="date"
                        value={form.fornecedorDesde}
                        onChange={atualizarCampo}
                      />
                    </Field>
                  </FormColumn>

                  <FormColumn>
                    <FieldGroupTitle>
                      <Icon name="person-lines-fill" size={16} />
                      Informações de contato
                    </FieldGroupTitle>
                    <Field>
                      <label>Pessoa de contato *</label>
                      <input
                        name="contato"
                        value={form.contato}
                        onChange={atualizarCampo}
                        placeholder="Ex.: João Silva"
                      />
                    </Field>
                    <Field>
                      <label>E-mail *</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={atualizarCampo}
                        placeholder="contato@fornecedor.com"
                      />
                    </Field>
                    <Field>
                      <label>Telefone *</label>
                      <input
                        name="telefone"
                        value={form.telefone}
                        onChange={atualizarCampo}
                        placeholder="+55 (99) 9 9999-9999"
                      />
                    </Field>
                    <Field>
                      <label>Endereço</label>
                      <input
                        name="endereco"
                        value={form.endereco}
                        onChange={atualizarCampo}
                        placeholder="Rua, número, complemento"
                      />
                    </Field>
                    <FieldRow>
                      <Field>
                        <label>Cidade</label>
                        <input
                          name="cidade"
                          value={form.cidade}
                          onChange={atualizarCampo}
                          placeholder="Cidade"
                        />
                      </Field>
                      <Field>
                        <label>Estado</label>
                        <input
                          name="estado"
                          value={form.estado}
                          onChange={atualizarCampo}
                          placeholder="UF"
                          maxLength={2}
                        />
                      </Field>
                    </FieldRow>
                  </FormColumn>
                </FormTwoCol>

                <SectionDivider />

                <FieldGroupTitle>
                  <Icon name="exclamation-circle-fill" size={16} />
                  Informações adicionais
                </FieldGroupTitle>
                <FormTwoCol>
                  <FormColumn>
                    <Field>
                      <label>Condições de pagamento</label>
                      <input
                        name="condicoesPagamento"
                        value={form.condicoesPagamento}
                        onChange={atualizarCampo}
                        placeholder="Ex.: 30 dias, cheque, etc."
                      />
                    </Field>
                    <Field>
                      <label>Condições de pagamento (2)</label>
                      <input
                        name="condicoesPagamento2"
                        value={form.condicoesPagamento2}
                        onChange={atualizarCampo}
                        placeholder="Ex.: PIX, boleto…"
                      />
                    </Field>
                  </FormColumn>
                  <FormColumn>
                    <Field>
                      <label>Observações</label>
                      <TextAreaField
                        name="observacoes"
                        value={form.observacoes}
                        onChange={atualizarCampo}
                        placeholder="Alguma informação adicional importante"
                      />
                    </Field>
                    <ToggleRow>
                      <ToggleInput
                        type="checkbox"
                        checked={form.status === "ativo"}
                        onChange={atualizarAtivo}
                      />
                      Ativo
                    </ToggleRow>
                  </FormColumn>
                </FormTwoCol>

                <SectionDivider />

                <FieldGroupTitle>
                  <Icon name="file-earmark-text-fill" size={16} />
                  Documentos
                </FieldGroupTitle>
                <FileBrowseRow>
                  <input
                    type="text"
                    readOnly
                    value={form.documentoNome || "Nenhum arquivo selecionado"}
                  />
                  <label style={{ cursor: "pointer", margin: 0 }}>
                    <BrowseButton>Browse</BrowseButton>
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx,.png,.jpg"
                      onChange={selecionarDocumento}
                    />
                  </label>
                </FileBrowseRow>
              </ModalBody>

              <FormActions>
                <IconButton type="button" onClick={fecharModal}>
                  <Icon name="x-lg" size={13} />
                  Cancelar
                </IconButton>
                <ActionButton type="button" onClick={salvar}>
                  <Icon name="floppy-fill" size={14} color="#fff" />
                  Salvar fornecedor
                </ActionButton>
              </FormActions>
            </FormModal>
          )}
        </ModalBackdrop>
      )}
    </Page>
  );
}
