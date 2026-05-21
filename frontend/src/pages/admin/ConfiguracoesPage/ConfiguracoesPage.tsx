import { useMemo, useState, type FormEvent } from "react";
import { Icon } from "@components/atoms/Icon";
import { useFuncionarios } from "@/contexts/FuncionariosContext";
import { useSessao } from "@/contexts/SessaoContext";
import {
  perfilFuncionarioLabels,
  perfilSistemaDescricoes,
  perfilSistemaLabels,
  type PerfilSistema,
} from "@/config/permissoes";
import { statusRhLabels } from "@/data/mockFuncionarios";
import { formatarNomeFuncionario } from "@/utils/formatFuncionarioRegistro";
import {
  isCodigoServicoValido,
  normalizarCodigoServico,
} from "@/utils/funcionarioCodigo";
import {
  Avatar,
  Erro,
  FieldGrid,
  FieldRow,
  LogoutBtn,
  LogoutSection,
  Page,
  PageHeader,
  PerfilBadge,
  ProfileCard,
  ProfileMain,
  ProfileMeta,
  Section,
  SectionTitle,
  TesteCard,
  TesteRow,
  VincularForm,
} from "./ConfiguracoesPage.styles";

function iniciais(nome: string, sobrenome: string) {
  const a = nome.trim().charAt(0) || "?";
  const b = sobrenome.trim().charAt(0) || "";
  return (a + b).toUpperCase();
}

function formatarDataBr(iso: string) {
  if (!iso) return "—";
  return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR");
}

export function ConfiguracoesPage() {
  const {
    perfil,
    funcionarioId,
    administrador,
    adminUser,
    setPerfil,
    setFuncionarioId,
    logout,
  } = useSessao();
  const { funcionarios, buscarPorCodigoServico } = useFuncionarios();
  const [codigoVincular, setCodigoVincular] = useState("");
  const [erroVincular, setErroVincular] = useState("");

  const funcionario = useMemo(() => {
    if (perfil === "dono" || !funcionarioId) return null;
    return funcionarios.find((f) => f.id === funcionarioId) ?? null;
  }, [funcionarios, funcionarioId, perfil]);

  const vincularPorCodigo = (event: FormEvent) => {
    event.preventDefault();
    setErroVincular("");
    if (!isCodigoServicoValido(codigoVincular)) {
      setErroVincular("Informe um código de 4 a 6 dígitos.");
      return;
    }
    const encontrado = buscarPorCodigoServico(codigoVincular, [
      perfil === "mecanico" ? "mecanico" : "atendente",
    ]);
    if (!encontrado) {
      setErroVincular("Código não encontrado para este perfil.");
      return;
    }
    setFuncionarioId(encontrado.id);
    setCodigoVincular("");
  };

  const nomeExibicao =
    perfil === "dono"
      ? adminUser?.nome ??
        formatarNomeFuncionario(administrador.nome, administrador.sobrenome)
      : funcionario
        ? formatarNomeFuncionario(funcionario.nome, funcionario.sobrenome)
        : "—";

  const fotoUrl =
    perfil === "dono" ? administrador.fotoUrl : funcionario?.fotoUrl;

  return (
    <Page>
      <PageHeader>
        <h1>Configurações</h1>
        <p>Perfil e dados da conta em uso no sistema administrativo.</p>
      </PageHeader>

      <ProfileCard>
        <Avatar $src={fotoUrl || undefined}>
          {!fotoUrl && iniciais(
            perfil === "dono" ? administrador.nome : funcionario?.nome ?? "?",
            perfil === "dono"
              ? administrador.sobrenome
              : funcionario?.sobrenome ?? "",
          )}
        </Avatar>
        <ProfileMain>
          <PerfilBadge $perfil={perfil}>
            {perfilSistemaLabels[perfil]}
          </PerfilBadge>
          <h2>{nomeExibicao}</h2>
          <ProfileMeta>{perfilSistemaDescricoes[perfil]}</ProfileMeta>
        </ProfileMain>
      </ProfileCard>

      <Section>
        <SectionTitle>Dados do perfil</SectionTitle>
        <FieldGrid>
          {perfil === "dono" ? (
            <>
              <FieldRow>
                <dt>E-mail</dt>
                <dd>{adminUser?.email ?? administrador.email}</dd>
              </FieldRow>
              <FieldRow>
                <dt>Telefone</dt>
                <dd>{administrador.telefone}</dd>
              </FieldRow>
              <FieldRow>
                <dt>Empresa</dt>
                <dd>{administrador.empresa}</dd>
              </FieldRow>
              <FieldRow>
                <dt>Cargo</dt>
                <dd>{administrador.cargo}</dd>
              </FieldRow>
              <FieldRow>
                <dt>Acesso</dt>
                <dd>Total (financeiro, administrativo, CRH)</dd>
              </FieldRow>
              <FieldRow>
                <dt>Cadastro CRH</dt>
                <dd>Não — perfil administrativo fora do quadro de funcionários</dd>
              </FieldRow>
            </>
          ) : funcionario ? (
            <>
              <FieldRow>
                <dt>Função</dt>
                <dd>{perfilFuncionarioLabels[funcionario.perfil]}</dd>
              </FieldRow>
              <FieldRow>
                <dt>Código de serviço</dt>
                <dd>{funcionario.codigoServico}</dd>
              </FieldRow>
              <FieldRow>
                <dt>E-mail</dt>
                <dd>{funcionario.email || "—"}</dd>
              </FieldRow>
              <FieldRow>
                <dt>CPF</dt>
                <dd>{funcionario.cpf || "—"}</dd>
              </FieldRow>
              <FieldRow>
                <dt>Admissão</dt>
                <dd>{formatarDataBr(funcionario.dataAdmissao)}</dd>
              </FieldRow>
              <FieldRow>
                <dt>Status RH</dt>
                <dd>{statusRhLabels[funcionario.statusRh]}</dd>
              </FieldRow>
              {funcionario.cnh && (
                <FieldRow>
                  <dt>CNH</dt>
                  <dd>
                    {funcionario.cnh}
                    {funcionario.cnhValidade &&
                      ` · validade ${formatarDataBr(funcionario.cnhValidade)}`}
                  </dd>
                </FieldRow>
              )}
              {(funcionario.feriasInicio || funcionario.feriasFim) && (
                <FieldRow>
                  <dt>Férias</dt>
                  <dd>
                    {formatarDataBr(funcionario.feriasInicio)} até{" "}
                    {formatarDataBr(funcionario.feriasFim)}
                  </dd>
                </FieldRow>
              )}
            </>
          ) : (
            <FieldRow>
              <dt>Conta</dt>
              <dd>Vincule seu código de serviço abaixo (teste).</dd>
            </FieldRow>
          )}
        </FieldGrid>

        <LogoutSection>
          <LogoutBtn type="button" onClick={logout}>
            <Icon name="box-arrow-right" size={18} color="#fff" />
            Sair do perfil
          </LogoutBtn>
        </LogoutSection>
      </Section>

      <TesteCard>
        <h3>Ambiente de teste (sem login no banco)</h3>
        <p>
          Até o backend liberar cadastro e login, simule qual perfil está usando
          o painel. Atendentes: 1001 / 1002 · Mecânico: 2001.
        </p>
        <TesteRow>
          <label htmlFor="perfil-teste">Perfil ativo</label>
          <select
            id="perfil-teste"
            value={perfil}
            onChange={(e) => setPerfil(e.target.value as PerfilSistema)}
          >
            <option value="dono">{perfilSistemaLabels.dono}</option>
            <option value="atendente">{perfilSistemaLabels.atendente}</option>
            <option value="mecanico">{perfilSistemaLabels.mecanico}</option>
          </select>
        </TesteRow>
        {perfil !== "dono" && (
          <VincularForm onSubmit={vincularPorCodigo}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Código de serviço"
              value={codigoVincular}
              onChange={(e) =>
                setCodigoVincular(normalizarCodigoServico(e.target.value))
              }
            />
            <button type="submit">Vincular conta</button>
          </VincularForm>
        )}
        {erroVincular && <Erro>{erroVincular}</Erro>}
      </TesteCard>
    </Page>
  );
}
