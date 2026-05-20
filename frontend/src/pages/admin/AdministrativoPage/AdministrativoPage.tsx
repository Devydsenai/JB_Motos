import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Icon } from "@components/atoms/Icon";
import {
  funcionarioInicial,
  useFuncionarios,
} from "@/contexts/FuncionariosContext";
import { statusRhLabels } from "@/data/mockFuncionarios";
import {
  perfilFuncionarioDescricoes,
  perfilFuncionarioLabels,
  perfilSistemaDescricoes,
  perfilSistemaLabels,
  permissoesPorPerfil,
  type PerfilFuncionario,
} from "@/config/permissoes";
import type { Funcionario, StatusRh } from "@/types/funcionario";
import {
  formatarCodigoServico,
  isCodigoServicoValido,
} from "@/utils/funcionarioCodigo";
import {
  exportContratacaoPdf,
  exportRescisaoCsv,
  exportRescisaoPdf,
  type EmpresaRhInfo,
} from "@/utils/exportRhDocuments";
import {
  ActionButton,
  AddEmailButton,
  AvatarCameraBtn,
  AvatarPhoto,
  AvatarWrap,
  Card,
  CrachaHint,
  DemissaoModal,
  DocActions,
  EmployeeCell,
  CardHeader,
  CloseButton,
  EmailAddRow,
  EmailItem,
  EmailList,
  Field,
  FieldFull,
  FieldGrid,
  FormModal,
  GridTwo,
  HeaderActions,
  IconButton,
  InfoBox,
  ListHeader,
  ListTitle,
  ModalBackdrop,
  ModalBody,
  ModalFooter,
  ModalHeader,
  OutlineButton,
  Page,
  PerfilBadge,
  PermCard,
  PrimaryButton,
  ProfilePreview,
  RowActions,
  SectionTitle,
  StatusBadge,
  StatusOk,
  SummaryCard,
  SummaryGrid,
  SummaryIcon,
  SummaryLabel,
  SummaryValue,
  SwitchInput,
  SwitchRow,
  TabBar,
  TabButton,
  Table,
  TableAvatar,
  TableWrap,
  TempoTrabalho,
} from "./AdministrativoPage.styles";

type Aba = "crh" | "sistema" | "estoque" | "notificacoes" | "info";

const CONFIG_KEY = "jb-motos-admin-config";

type AdminConfig = {
  nomeEmpresa: string;
  moeda: string;
  fuso: string;
  formatoData: string;
  endereco: string;
  alertaEstoqueBaixo: boolean;
  estoqueNegativo: boolean;
  validadeProdutos: boolean;
  controleLotes: boolean;
  nivelMinimoPadrao: string;
  unidadeMedida: string;
  notificarEstoqueBaixo: boolean;
  notificarMovimentacoes: boolean;
  emailsNotificacao: string[];
};

const configPadrao: AdminConfig = {
  nomeEmpresa: "JB Motos",
  moeda: "BRL",
  fuso: "America/Sao_Paulo",
  formatoData: "DD/MM/YYYY",
  endereco: "",
  alertaEstoqueBaixo: true,
  estoqueNegativo: false,
  validadeProdutos: false,
  controleLotes: true,
  nivelMinimoPadrao: "5",
  unidadeMedida: "unidades",
  notificarEstoqueBaixo: true,
  notificarMovimentacoes: false,
  emailsNotificacao: ["rh@jbmotos.com"],
};

function readConfig(): AdminConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return configPadrao;
    return { ...configPadrao, ...JSON.parse(raw) };
  } catch {
    return configPadrao;
  }
}

function deriveStatusRh(f: Funcionario): StatusRh {
  if (f.statusRh === "demitido" && !f.ativo) return "demitido";
  if (f.avisoPrevio) return "aviso_previo";
  if (f.acidente) return "acidente";
  if (f.gestante) return "gestante";
  if (f.feriasInicio && f.feriasFim) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const ini = new Date(f.feriasInicio + "T12:00:00");
    const fim = new Date(f.feriasFim + "T12:00:00");
    if (hoje >= ini && hoje <= fim) return "ferias";
  }
  if (!f.ativo) return "afastado";
  return "ativo";
}

function calcTempoTrabalho(dataAdmissao: string): string {
  if (!dataAdmissao) return "—";
  const adm = new Date(dataAdmissao + "T12:00:00");
  const hoje = new Date();
  let anos = hoje.getFullYear() - adm.getFullYear();
  let meses = hoje.getMonth() - adm.getMonth();
  if (meses < 0) {
    anos -= 1;
    meses += 12;
  }
  if (anos > 0 && meses > 0) return `${anos} ano(s) e ${meses} mês(es)`;
  if (anos > 0) return `${anos} ano(s)`;
  if (meses > 0) return `${meses} mês(es)`;
  return "Menos de 1 mês";
}

function iniciais(nome: string, sobrenome: string) {
  return `${nome.charAt(0)}${sobrenome.charAt(0)}`.toUpperCase() || "?";
}

export function AdministrativoPage() {
  const {
    funcionarios,
    salvarFuncionario,
    demitirFuncionario,
    excluirFuncionario,
    codigoServicoEmUso,
  } = useFuncionarios();

  const [aba, setAba] = useState<Aba>("crh");
  const [config, setConfig] = useState<AdminConfig>(readConfig);
  const [emailNovo, setEmailNovo] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [demitindo, setDemitindo] = useState<Funcionario | null>(null);
  const [dataDemissao, setDataDemissao] = useState("");
  const [motivoDemissao, setMotivoDemissao] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState<Funcionario>(funcionarioInicial);

  const empresaRh: EmpresaRhInfo = useMemo(
    () => ({
      nomeEmpresa: config.nomeEmpresa,
      endereco: config.endereco,
    }),
    [config.nomeEmpresa, config.endereco],
  );

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    } catch {
      /* ignore */
    }
  }, [config]);

  const resumo = useMemo(() => {
    const ativos = funcionarios.filter((f) => f.ativo).length;
    const ferias = funcionarios.filter((f) => f.statusRh === "ferias").length;
    const alertas = funcionarios.filter(
      (f) =>
        f.gestante ||
        f.acidente ||
        f.avisoPrevio ||
        f.statusRh === "gestante",
    ).length;
    const demitidos = funcionarios.filter((f) => f.statusRh === "demitido").length;
    return {
      total: funcionarios.length,
      ativos,
      ferias,
      alertas,
      demitidos,
    };
  }, [funcionarios]);

  const abrirNovo = useCallback(() => {
    setEditandoId(null);
    setForm({ ...funcionarioInicial, id: `func-${Date.now()}` });
    setModalAberto(true);
  }, []);

  const abrirEditar = useCallback((f: Funcionario) => {
    setEditandoId(f.id);
    setForm({ ...f });
    setModalAberto(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setEditandoId(null);
  }, []);

  const onChange =
    (campo: keyof Funcionario) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { value, type } = e.target;
      const checked =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
      setForm((prev) => ({
        ...prev,
        [campo]: type === "checkbox" ? checked : value,
      }));
    };

  const onFotoChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Selecione uma imagem (JPG ou PNG).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      window.alert("A foto do crachá deve ter no máximo 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, fotoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const salvar = useCallback(() => {
    if (!form.nome.trim() || !form.email.trim()) return;
    const codigo = formatarCodigoServico(form.codigoServico);
    if (!isCodigoServicoValido(codigo)) {
      window.alert("Informe o código de serviço com 4 a 6 dígitos numéricos.");
      return;
    }
    if (codigoServicoEmUso(codigo, editandoId ?? undefined)) {
      window.alert("Este código de serviço já está em uso por outro funcionário.");
      return;
    }
    const atualizado: Funcionario = {
      ...form,
      codigoServico: codigo,
      statusRh: deriveStatusRh(form),
    };
    const ehNovo = !editandoId;
    salvarFuncionario(atualizado, editandoId);
    fecharModal();
    if (
      ehNovo &&
      window.confirm(
        "Funcionário salvo. Deseja gerar o contrato de contratação em PDF para assinatura?",
      )
    ) {
      exportContratacaoPdf(atualizado, empresaRh);
    }
  }, [
    form,
    editandoId,
    salvarFuncionario,
    fecharModal,
    empresaRh,
    codigoServicoEmUso,
  ]);

  const abrirDemissao = useCallback((f: Funcionario) => {
    setDemitindo(f);
    setDataDemissao(new Date().toISOString().slice(0, 10));
    setMotivoDemissao("");
  }, []);

  const confirmarDemissao = useCallback(() => {
    if (!demitindo || !dataDemissao.trim()) {
      window.alert("Informe a data de demissão.");
      return;
    }
    const demitido = demitirFuncionario(
      demitindo.id,
      dataDemissao,
      motivoDemissao.trim(),
    );
    setDemitindo(null);
    if (
      demitido &&
      window.confirm(
        "Demissão registrada. Gerar documentação de rescisão em PDF (dados já preenchidos)?",
      )
    ) {
      exportRescisaoPdf(demitido, empresaRh);
    }
  }, [demitindo, dataDemissao, motivoDemissao, demitirFuncionario, empresaRh]);

  const adicionarEmail = useCallback(() => {
    const email = emailNovo.trim();
    if (!email || config.emailsNotificacao.includes(email)) return;
    setConfig((c) => ({
      ...c,
      emailsNotificacao: [...c.emailsNotificacao, email],
    }));
    setEmailNovo("");
  }, [emailNovo, config.emailsNotificacao]);

  return (
    <Page>
      <TabBar>
        <TabButton $active={aba === "crh"} type="button" onClick={() => setAba("crh")}>
          <Icon name="people-fill" size={16} color={aba === "crh" ? "#fff" : undefined} />
          CRH — Funcionários
        </TabButton>
        <TabButton
          $active={aba === "sistema"}
          type="button"
          onClick={() => setAba("sistema")}
        >
          <Icon name="gear-fill" size={16} color={aba === "sistema" ? "#fff" : undefined} />
          Sistema
        </TabButton>
        <TabButton
          $active={aba === "estoque"}
          type="button"
          onClick={() => setAba("estoque")}
        >
          <Icon name="box-seam-fill" size={16} color={aba === "estoque" ? "#fff" : undefined} />
          Estoque
        </TabButton>
        <TabButton
          $active={aba === "notificacoes"}
          type="button"
          onClick={() => setAba("notificacoes")}
        >
          <Icon name="envelope-fill" size={16} color={aba === "notificacoes" ? "#fff" : undefined} />
          Notificações
        </TabButton>
        <TabButton $active={aba === "info"} type="button" onClick={() => setAba("info")}>
          <Icon name="info-circle-fill" size={16} color={aba === "info" ? "#fff" : undefined} />
          Informações
        </TabButton>
      </TabBar>

      {aba === "crh" && (
        <>
          <SummaryGrid>
            <SummaryCard>
              <div>
                <SummaryLabel>Total de funcionários</SummaryLabel>
                <SummaryValue>{resumo.total}</SummaryValue>
              </div>
              <SummaryIcon $bg="#fee2e2">
                <Icon name="people-fill" size={22} color="#c41e1e" />
              </SummaryIcon>
            </SummaryCard>
            <SummaryCard>
              <div>
                <SummaryLabel>Ativos</SummaryLabel>
                <SummaryValue>{resumo.ativos}</SummaryValue>
              </div>
              <SummaryIcon $bg="#dcfce7">
                <Icon name="check-circle-fill" size={22} color="#15803d" />
              </SummaryIcon>
            </SummaryCard>
            <SummaryCard>
              <div>
                <SummaryLabel>Em férias</SummaryLabel>
                <SummaryValue>{resumo.ferias}</SummaryValue>
              </div>
              <SummaryIcon $bg="#dbeafe">
                <Icon name="calendar-event" size={22} color="#1d4ed8" />
              </SummaryIcon>
            </SummaryCard>
            <SummaryCard>
              <div>
                <SummaryLabel>Alertas RH</SummaryLabel>
                <SummaryValue>{resumo.alertas}</SummaryValue>
              </div>
              <SummaryIcon $bg="#fef3c7">
                <Icon name="exclamation-triangle-fill" size={22} color="#d97706" />
              </SummaryIcon>
            </SummaryCard>
          </SummaryGrid>

          <Card>
            <ListHeader>
              <ListTitle>
                <h1>Cadastro de funcionários (CRH)</h1>
                <p>
                  Cadastre apenas <strong>atendentes</strong> e{" "}
                  <strong>mecânicos</strong>. O dono/administrador não entra no
                  CRH — ele admite e demite por aqui. Gere contrato (PDF) na
                  contratação e rescisão (PDF/CSV) na demissão.
                </p>
              </ListTitle>
              <HeaderActions>
                <ActionButton type="button" onClick={abrirNovo}>
                  <Icon name="plus-lg" size={16} color="#fff" />
                  Novo funcionário
                </ActionButton>
              </HeaderActions>
            </ListHeader>

            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <th>Cód. serviço</th>
                    <th>Funcionário</th>
                    <th>Perfil</th>
                    <th>Tempo de trabalho</th>
                    <th>Salário bruto</th>
                    <th>Férias</th>
                    <th>Status RH</th>
                    <th>Documentos</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((f) => (
                    <tr key={f.id}>
                      <td>
                        <strong style={{ fontVariantNumeric: "tabular-nums" }}>
                          {f.codigoServico || "—"}
                        </strong>
                      </td>
                      <td>
                        <EmployeeCell>
                          <TableAvatar $src={f.fotoUrl || undefined}>
                            {!f.fotoUrl &&
                              iniciais(f.nome, f.sobrenome)}
                          </TableAvatar>
                          <div>
                            <strong>
                              {f.nome} {f.sobrenome}
                            </strong>
                            <br />
                            <small style={{ color: "#6b7280" }}>
                              {f.email}
                            </small>
                          </div>
                        </EmployeeCell>
                      </td>
                      <td>
                        <PerfilBadge>
                          {perfilFuncionarioLabels[f.perfil]}
                        </PerfilBadge>
                      </td>
                      <td>{calcTempoTrabalho(f.dataAdmissao)}</td>
                      <td>{f.salarioBruto || "—"}</td>
                      <td>
                        {f.feriasInicio && f.feriasFim
                          ? `${f.feriasInicio.split("-").reverse().join("/")} — ${f.feriasFim.split("-").reverse().join("/")}`
                          : "—"}
                      </td>
                      <td>
                        <StatusBadge $status={f.statusRh}>
                          {statusRhLabels[f.statusRh]}
                        </StatusBadge>
                      </td>
                      <td>
                        <DocActions>
                          <IconButton
                            type="button"
                            title="Contrato de contratação (PDF)"
                            onClick={() =>
                              exportContratacaoPdf(f, empresaRh)
                            }
                          >
                            <Icon name="file-earmark-text" size={18} />
                          </IconButton>
                          <IconButton
                            type="button"
                            title="Rescisão (PDF)"
                            onClick={() => exportRescisaoPdf(f, empresaRh)}
                          >
                            <Icon name="file-earmark-pdf" size={18} />
                          </IconButton>
                          <IconButton
                            type="button"
                            title="Rescisão (CSV)"
                            onClick={() => exportRescisaoCsv(f, empresaRh)}
                          >
                            <Icon name="filetype-csv" size={18} />
                          </IconButton>
                        </DocActions>
                      </td>
                      <td>
                        <RowActions>
                          <IconButton
                            type="button"
                            title="Editar"
                            onClick={() => abrirEditar(f)}
                          >
                            <Icon name="pencil" size={18} />
                          </IconButton>
                          {f.ativo && f.statusRh !== "demitido" && (
                            <IconButton
                              type="button"
                              title="Demitir funcionário"
                              onClick={() => abrirDemissao(f)}
                            >
                              <Icon name="person-x" size={18} />
                            </IconButton>
                          )}
                          <IconButton
                            type="button"
                            title="Excluir cadastro"
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Excluir o cadastro de ${f.nome} ${f.sobrenome}?`,
                                )
                              ) {
                                excluirFuncionario(f.id);
                              }
                            }}
                          >
                            <Icon name="trash" size={18} />
                          </IconButton>
                        </RowActions>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          </Card>
        </>
      )}

      {aba === "sistema" && (
        <Card>
          <CardHeader>
            <Icon name="gear-fill" size={20} color="#c41e1e" />
            <h2>Configurações do sistema</h2>
          </CardHeader>
          <FieldGrid>
            <Field>
              <label htmlFor="nomeEmpresa">Nome da empresa</label>
              <input
                id="nomeEmpresa"
                value={config.nomeEmpresa}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, nomeEmpresa: e.target.value }))
                }
              />
            </Field>
            <Field>
              <label htmlFor="moeda">Moeda padrão</label>
              <select
                id="moeda"
                value={config.moeda}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, moeda: e.target.value }))
                }
              >
                <option value="BRL">Real Brasileiro (R$)</option>
                <option value="USD">Dólar (US$)</option>
              </select>
            </Field>
            <Field>
              <label htmlFor="fuso">Fuso horário</label>
              <select
                id="fuso"
                value={config.fuso}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, fuso: e.target.value }))
                }
              >
                <option value="America/Sao_Paulo">(UTC-03:00) Brasília</option>
              </select>
            </Field>
            <Field>
              <label htmlFor="formatoData">Formato de data</label>
              <select
                id="formatoData"
                value={config.formatoData}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, formatoData: e.target.value }))
                }
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </Field>
            <FieldFull>
              <label htmlFor="endereco">Endereço</label>
              <input
                id="endereco"
                value={config.endereco}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, endereco: e.target.value }))
                }
                placeholder="Rua, número — Cidade/UF"
              />
            </FieldFull>
          </FieldGrid>
        </Card>
      )}

      {aba === "estoque" && (
        <Card>
          <CardHeader>
            <Icon name="box-seam-fill" size={20} color="#c41e1e" />
            <h2>Configurações do estoque</h2>
          </CardHeader>
          <SwitchRow>
            <div>
              <strong>Alertas de estoque baixo</strong>
              <span>Notificar quando produtos atingirem níveis mínimos.</span>
            </div>
            <SwitchInput
              type="checkbox"
              checked={config.alertaEstoqueBaixo}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  alertaEstoqueBaixo: e.target.checked,
                }))
              }
            />
          </SwitchRow>
          <SwitchRow>
            <div>
              <strong>Permitir estoque negativo</strong>
              <span>Permitir saídas mesmo sem saldo disponível.</span>
            </div>
            <SwitchInput
              type="checkbox"
              checked={config.estoqueNegativo}
              onChange={(e) =>
                setConfig((c) => ({ ...c, estoqueNegativo: e.target.checked }))
              }
            />
          </SwitchRow>
          <SwitchRow>
            <div>
              <strong>Ativar validade de produtos</strong>
              <span>Controlar data de validade no cadastro.</span>
            </div>
            <SwitchInput
              type="checkbox"
              checked={config.validadeProdutos}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  validadeProdutos: e.target.checked,
                }))
              }
            />
          </SwitchRow>
          <SwitchRow>
            <div>
              <strong>Ativar controle de lotes</strong>
              <span>Rastrear produtos por lote ou série.</span>
            </div>
            <SwitchInput
              type="checkbox"
              checked={config.controleLotes}
              onChange={(e) =>
                setConfig((c) => ({ ...c, controleLotes: e.target.checked }))
              }
            />
          </SwitchRow>
          <FieldGrid style={{ marginTop: "1rem" }}>
            <Field>
              <label htmlFor="nivelMin">Nível mínimo padrão</label>
              <input
                id="nivelMin"
                type="number"
                min={0}
                value={config.nivelMinimoPadrao}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    nivelMinimoPadrao: e.target.value,
                  }))
                }
              />
            </Field>
            <Field>
              <label htmlFor="unidade">Unidade de medida padrão</label>
              <select
                id="unidade"
                value={config.unidadeMedida}
                onChange={(e) =>
                  setConfig((c) => ({ ...c, unidadeMedida: e.target.value }))
                }
              >
                <option value="unidades">Unidades</option>
                <option value="pecas">Peças</option>
                <option value="litros">Litros</option>
              </select>
            </Field>
          </FieldGrid>
        </Card>
      )}

      {aba === "notificacoes" && (
        <Card>
          <CardHeader>
            <Icon name="envelope-fill" size={20} color="#c41e1e" />
            <h2>Notificações por e-mail</h2>
          </CardHeader>
          <SwitchRow>
            <div>
              <strong>Notificar estoque baixo</strong>
              <span>Enviar e-mail quando produtos atingirem níveis mínimos.</span>
            </div>
            <SwitchInput
              type="checkbox"
              checked={config.notificarEstoqueBaixo}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  notificarEstoqueBaixo: e.target.checked,
                }))
              }
            />
          </SwitchRow>
          <Field style={{ marginTop: "1rem" }}>
            <label>E-mails para notificação (RH / estoque)</label>
            <EmailAddRow>
              <input
                type="email"
                placeholder="Adicionar e-mail"
                value={emailNovo}
                onChange={(e) => setEmailNovo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && adicionarEmail()}
              />
              <AddEmailButton type="button" onClick={adicionarEmail}>
                <Icon name="plus-lg" size={18} color="#fff" />
              </AddEmailButton>
            </EmailAddRow>
            <EmailList>
              {config.emailsNotificacao.map((email) => (
                <EmailItem key={email}>
                  {email}
                  <button
                    type="button"
                    onClick={() =>
                      setConfig((c) => ({
                        ...c,
                        emailsNotificacao: c.emailsNotificacao.filter(
                          (e) => e !== email,
                        ),
                      }))
                    }
                  >
                    ×
                  </button>
                </EmailItem>
              ))}
            </EmailList>
          </Field>
          <SwitchRow>
            <div>
              <strong>Notificar movimentações críticas</strong>
              <span>Alertas para grandes movimentações de estoque.</span>
            </div>
            <SwitchInput
              type="checkbox"
              checked={config.notificarMovimentacoes}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  notificarMovimentacoes: e.target.checked,
                }))
              }
            />
          </SwitchRow>
        </Card>
      )}

      {aba === "info" && (
        <GridTwo>
          <Card>
            <CardHeader>
              <Icon name="info-circle-fill" size={20} color="#c41e1e" />
              <h2>Informações do sistema</h2>
            </CardHeader>
            <FieldGrid>
              <Field>
                <label>Versão</label>
                <InfoBox>JB Motos v1.0.0</InfoBox>
              </Field>
              <Field>
                <label>Última atualização</label>
                <InfoBox>18/05/2026</InfoBox>
              </Field>
              <Field>
                <label>Licença</label>
                <InfoBox>Licença empresarial (válida até 18/05/2027)</InfoBox>
              </Field>
              <Field>
                <label>Último backup</label>
                <InfoBox>18/05/2026 09:00</InfoBox>
              </Field>
              <FieldFull>
                <label>Status</label>
                <StatusOk>
                  <Icon name="check-circle-fill" size={18} color="#15803d" />
                  Sistema atualizado
                </StatusOk>
              </FieldFull>
            </FieldGrid>
            <PrimaryButton type="button">
              <Icon name="save" size={18} color="#fff" />
              Fazer backup agora
            </PrimaryButton>
          </Card>
          <Card>
            <CardHeader>
              <Icon name="shield-lock-fill" size={20} color="#c41e1e" />
              <h2>Perfis de acesso</h2>
            </CardHeader>
            <PermCard style={{ marginBottom: "0.75rem" }}>
              <strong>{perfilSistemaLabels.dono}</strong>
              {perfilSistemaDescricoes.dono}
              <br />
              <em>Rotas: {permissoesPorPerfil.dono.join(", ")}</em>
            </PermCard>
            {(["atendente", "mecanico"] as PerfilFuncionario[]).map((perfil) => (
              <PermCard key={perfil} style={{ marginBottom: "0.75rem" }}>
                <strong>{perfilFuncionarioLabels[perfil]}</strong>
                {perfilFuncionarioDescricoes[perfil]}
                <br />
                <em>Rotas: {permissoesPorPerfil[perfil].join(", ")}</em>
              </PermCard>
            ))}
          </Card>
        </GridTwo>
      )}

      {modalAberto && (
        <ModalBackdrop onClick={fecharModal}>
          <FormModal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>
                {editandoId ? "Editar funcionário" : "Novo funcionário"}
              </h2>
              <CloseButton type="button" onClick={fecharModal}>
                <Icon name="x-lg" size={14} color="#fff" />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <ProfilePreview>
                <AvatarWrap>
                  <AvatarPhoto $src={form.fotoUrl || undefined}>
                    {!form.fotoUrl && iniciais(form.nome, form.sobrenome)}
                  </AvatarPhoto>
                  <AvatarCameraBtn title="Foto do crachá">
                    <Icon name="camera-fill" size={16} color="#fff" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFotoChange}
                    />
                  </AvatarCameraBtn>
                </AvatarWrap>
                <CrachaHint>Foto do crachá (JPG/PNG, até 2 MB)</CrachaHint>
                <strong>
                  {form.nome || "Nome"} {form.sobrenome || "Sobrenome"}
                </strong>
                <small>{form.email || "e-mail"}</small>
                <TempoTrabalho>
                  Tempo de trabalho: {calcTempoTrabalho(form.dataAdmissao)}
                </TempoTrabalho>
              </ProfilePreview>

              <div>
                <SectionTitle>
                  <Icon name="person-fill" size={16} color="#c41e1e" />
                  Perfil e acesso
                </SectionTitle>
                <FieldGrid>
                  <Field>
                    <label htmlFor="codigoServico">Código de serviço (ID)</label>
                    <input
                      id="codigoServico"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Ex.: 1001"
                      value={form.codigoServico}
                      onChange={onChange("codigoServico")}
                    />
                  </Field>
                  <Field>
                    <label htmlFor="perfil">Função no sistema</label>
                    <select
                      id="perfil"
                      value={form.perfil}
                      onChange={onChange("perfil")}
                    >
                      <option value="atendente">Atendente</option>
                      <option value="mecanico">Mecânico</option>
                    </select>
                  </Field>
                  <Field>
                    <label htmlFor="nome">Nome</label>
                    <input id="nome" value={form.nome} onChange={onChange("nome")} />
                  </Field>
                  <Field>
                    <label htmlFor="sobrenome">Sobrenome</label>
                    <input
                      id="sobrenome"
                      value={form.sobrenome}
                      onChange={onChange("sobrenome")}
                    />
                  </Field>
                  <FieldFull>
                    <label htmlFor="email">E-mail (login)</label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={onChange("email")}
                    />
                  </FieldFull>
                  <Field>
                    <label htmlFor="cpf">CPF</label>
                    <input
                      id="cpf"
                      placeholder="000.000.000-00"
                      value={form.cpf}
                      onChange={onChange("cpf")}
                    />
                  </Field>
                  <Field>
                    <label htmlFor="senha">Senha de acesso</label>
                    <input
                      id="senha"
                      type="password"
                      value={form.senha}
                      onChange={onChange("senha")}
                    />
                  </Field>
                  <FieldFull>
                    <PermCard>
                      <strong>
                        ID {form.codigoServico || "____"} —{" "}
                        {perfilFuncionarioLabels[form.perfil]}
                      </strong>
                      {perfilFuncionarioDescricoes[form.perfil]}
                      <br />
                      <em>
                        O atendente informa este código ao enviar a OS; o
                        mecânico ao assumir ou concluir o serviço.
                      </em>
                    </PermCard>
                  </FieldFull>
                </FieldGrid>
              </div>

              <div>
                <SectionTitle>
                  <Icon name="cash-stack" size={16} color="#c41e1e" />
                  Remuneração e vínculo
                </SectionTitle>
                <FieldGrid>
                  <Field>
                    <label htmlFor="salario">Salário bruto</label>
                    <input
                      id="salario"
                      placeholder="R$ 0,00"
                      value={form.salarioBruto}
                      onChange={onChange("salarioBruto")}
                    />
                  </Field>
                  <Field>
                    <label htmlFor="admissao">Data de admissão</label>
                    <input
                      id="admissao"
                      type="date"
                      value={form.dataAdmissao}
                      onChange={onChange("dataAdmissao")}
                    />
                  </Field>
                  <Field>
                    <label>
                      <input
                        type="checkbox"
                        checked={form.ativo}
                        onChange={onChange("ativo")}
                      />{" "}
                      Funcionário ativo
                    </label>
                  </Field>
                </FieldGrid>
              </div>

              <div>
                <SectionTitle>
                  <Icon name="calendar-event" size={16} color="#c41e1e" />
                  Férias
                </SectionTitle>
                <FieldGrid>
                  <Field>
                    <label htmlFor="feriasIni">Início das férias</label>
                    <input
                      id="feriasIni"
                      type="date"
                      value={form.feriasInicio}
                      onChange={onChange("feriasInicio")}
                    />
                  </Field>
                  <Field>
                    <label htmlFor="feriasFim">Fim das férias</label>
                    <input
                      id="feriasFim"
                      type="date"
                      value={form.feriasFim}
                      onChange={onChange("feriasFim")}
                    />
                  </Field>
                </FieldGrid>
              </div>

              <div>
                <SectionTitle>
                  <Icon name="card-text" size={16} color="#c41e1e" />
                  CNH
                </SectionTitle>
                <FieldGrid>
                  <Field>
                    <label htmlFor="cnh">Número da CNH</label>
                    <input id="cnh" value={form.cnh} onChange={onChange("cnh")} />
                  </Field>
                  <Field>
                    <label htmlFor="cnhVal">Validade da CNH</label>
                    <input
                      id="cnhVal"
                      type="date"
                      value={form.cnhValidade}
                      onChange={onChange("cnhValidade")}
                    />
                  </Field>
                </FieldGrid>
              </div>

              <div>
                <SectionTitle>
                  <Icon name="heart-pulse-fill" size={16} color="#c41e1e" />
                  Situações trabalhistas (RH)
                </SectionTitle>
                <FieldGrid>
                  <Field>
                    <label htmlFor="diaCiclo">
                      Dia do ciclo menstrual (1–28)
                    </label>
                    <input
                      id="diaCiclo"
                      type="number"
                      min={1}
                      max={28}
                      placeholder="Ex.: 12"
                      value={form.diaCicloMenstrual}
                      onChange={onChange("diaCicloMenstrual")}
                    />
                  </Field>
                  <Field>
                    <label>
                      <input
                        type="checkbox"
                        checked={form.gestante}
                        onChange={onChange("gestante")}
                      />{" "}
                      Gestante
                    </label>
                  </Field>
                  <Field>
                    <label htmlFor="parto">Previsão do parto</label>
                    <input
                      id="parto"
                      type="date"
                      value={form.dataPrevisaoParto}
                      onChange={onChange("dataPrevisaoParto")}
                      disabled={!form.gestante}
                    />
                  </Field>
                  <Field>
                    <label>
                      <input
                        type="checkbox"
                        checked={form.acidente}
                        onChange={onChange("acidente")}
                      />{" "}
                      Acidente de trabalho
                    </label>
                  </Field>
                  <Field>
                    <label htmlFor="acData">Data do acidente</label>
                    <input
                      id="acData"
                      type="date"
                      value={form.acidenteData}
                      onChange={onChange("acidenteData")}
                      disabled={!form.acidente}
                    />
                  </Field>
                  <FieldFull>
                    <label htmlFor="acDesc">Descrição do acidente</label>
                    <textarea
                      id="acDesc"
                      rows={2}
                      value={form.acidenteDescricao}
                      onChange={onChange("acidenteDescricao")}
                      disabled={!form.acidente}
                    />
                  </FieldFull>
                  <Field>
                    <label>
                      <input
                        type="checkbox"
                        checked={form.avisoPrevio}
                        onChange={onChange("avisoPrevio")}
                      />{" "}
                      Aviso prévio
                    </label>
                  </Field>
                  <Field>
                    <label htmlFor="avIni">Início aviso prévio</label>
                    <input
                      id="avIni"
                      type="date"
                      value={form.avisoPrevioInicio}
                      onChange={onChange("avisoPrevioInicio")}
                      disabled={!form.avisoPrevio}
                    />
                  </Field>
                  <Field>
                    <label htmlFor="avFim">Fim aviso prévio</label>
                    <input
                      id="avFim"
                      type="date"
                      value={form.avisoPrevioFim}
                      onChange={onChange("avisoPrevioFim")}
                      disabled={!form.avisoPrevio}
                    />
                  </Field>
                </FieldGrid>
              </div>
            </ModalBody>
            <ModalFooter>
              <OutlineButton
                type="button"
                onClick={() => exportContratacaoPdf(form, empresaRh)}
              >
                Prévia contrato PDF
              </OutlineButton>
              <OutlineButton type="button" onClick={fecharModal}>
                Cancelar
              </OutlineButton>
              <ActionButton type="button" onClick={salvar}>
                <Icon name="check-lg" size={16} color="#fff" />
                Salvar cadastro
              </ActionButton>
            </ModalFooter>
          </FormModal>
        </ModalBackdrop>
      )}

      {demitindo && (
        <ModalBackdrop
          onClick={() => setDemitindo(null)}
        >
          <DemissaoModal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Demitir — {demitindo.nome} {demitindo.sobrenome}</h2>
              <CloseButton type="button" onClick={() => setDemitindo(null)}>
                <Icon name="x-lg" size={14} color="#fff" />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <p style={{ fontSize: "0.8125rem", color: "#6b7280", marginBottom: "1rem" }}>
                Os dados do cadastro serão usados para gerar a documentação de
                rescisão (PDF e CSV) pronta para impressão e assinatura.
              </p>
              <Field>
                <label htmlFor="dataDemissao">Data da demissão</label>
                <input
                  id="dataDemissao"
                  type="date"
                  value={dataDemissao}
                  onChange={(e) => setDataDemissao(e.target.value)}
                />
              </Field>
              <Field>
                <label htmlFor="motivoDemissao">Motivo / observações</label>
                <textarea
                  id="motivoDemissao"
                  rows={3}
                  placeholder="Ex.: pedido de demissão, término de contrato..."
                  value={motivoDemissao}
                  onChange={(e) => setMotivoDemissao(e.target.value)}
                />
              </Field>
            </ModalBody>
            <ModalFooter>
              <OutlineButton type="button" onClick={() => setDemitindo(null)}>
                Cancelar
              </OutlineButton>
              <ActionButton type="button" onClick={confirmarDemissao}>
                <Icon name="file-earmark-pdf" size={16} color="#fff" />
                Confirmar demissão
              </ActionButton>
            </ModalFooter>
          </DemissaoModal>
        </ModalBackdrop>
      )}
    </Page>
  );
}
