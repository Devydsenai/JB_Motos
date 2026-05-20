import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StatusBadge } from "@components/molecules/StatusBadge";
import { adminRoutes } from "@/config/adminMenu";
import { useProdutos } from "@/contexts/ProdutosContext";
import { listarProdutosEstoqueBaixo } from "@/utils/produtoEstoque";
import { statusLabels } from "@/data/mockClientes";
import { CodigoFuncionarioModal } from "@components/molecules/CodigoFuncionarioModal";
import { useAtendimento } from "@/contexts/AtendimentoContext";
import { useSessao } from "@/contexts/SessaoContext";
import type { OrdemServico } from "@/types/atendimento";
import type { Funcionario } from "@/types/funcionario";
import {
  formatarNomeFuncionario,
  formatarRegistroFuncionario,
} from "@/utils/formatFuncionarioRegistro";
import { formatarDataBr, formatarHoraBr } from "@/utils/formatDateTime";
import { exportReportPdf } from "@/utils/exportReports";
import {
  AlertBanner,
  ConcludeRow,
  EmptyState,
  ExportActions,
  ExportBtn,
  Page,
  PageHeader,
  Panel,
  PanelHead,
  PanelHeadText,
  PrimaryBtn,
  ReqCard,
  ReqMeta,
  ReqTitle,
  StatusWaiting,
  SummaryCard,
  SummaryGrid,
  Table,
  ValorDestaque,
  WaitingGrid,
} from "./RequisicoesPage.styles";

const AGUARDANDO: OrdemServico["status"][] = [
  "pendente",
  "em_espera",
  "atendido",
];

const COLUNAS_RELATORIO = [
  "Serviço na moto",
  "Cliente",
  "Moto",
  "Peça",
  "Código peça",
  "Data conclusão",
  "Horário",
  "Valor",
  "ID atendente",
  "Atendente",
  "ID mecânico",
  "Mecânico",
  "Observação",
];

function ReqCardAguardando({
  ordem,
  onConcluir,
}: {
  ordem: OrdemServico;
  onConcluir: (id: string, valor: string) => void;
}) {
  const [valor, setValor] = useState(ordem.valorServico ?? "");

  return (
    <ReqCard>
      <StatusWaiting>
        {statusLabels[ordem.status]} — aguardando oficina
      </StatusWaiting>
      <ReqTitle>{ordem.servicoNaMoto}</ReqTitle>
      <ReqMeta>
        <strong>Cliente:</strong> {ordem.clienteNome}
        <br />
        <strong>Moto:</strong> {ordem.motoMarca} {ordem.motoModelo}
        {ordem.produtoNome && (
          <>
            <br />
            <strong>Peça:</strong> {ordem.produtoNome} ({ordem.produtoCodigo})
          </>
        )}
        <br />
        <strong>Solicitado:</strong> {formatarDataBr(ordem.solicitadoEm)}
        {ordem.origem === "balcao_atendente" && (
          <>
            <br />
            <strong>Atendente:</strong>{" "}
            {formatarRegistroFuncionario(
              ordem.atendenteCodigo,
              ordem.atendenteNome ?? ordem.atendente,
            )}
          </>
        )}
        {ordem.origem === "loja_online" && (
          <>
            <br />
            <strong>Pedido:</strong> loja online (cliente: {ordem.clienteNome})
          </>
        )}
        {ordem.mecanicoCodigo && (
          <>
            <br />
            <strong>Mecânico:</strong>{" "}
            {formatarRegistroFuncionario(
              ordem.mecanicoCodigo,
              ordem.mecanicoNome,
            )}
          </>
        )}
        {ordem.teveServicoAdicionalOficina === false && (
          <>
            <br />
            <strong>Oficina:</strong> sem serviço extra
          </>
        )}
        {ordem.servicosAdicionais?.map((s) => (
          <span key={`${s.produtoId}-${s.registradoEm}`}>
            <br />
            <strong>Serviço extra:</strong> {s.servicoRealizado} ({s.produtoNome})
          </span>
        ))}
        {ordem.observacao && (
          <>
            <br />
            <strong>Obs.:</strong> {ordem.observacao}
          </>
        )}
      </ReqMeta>
      <ConcludeRow>
        <label>
          Valor do serviço (R$)
          <input
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ex.: R$ 85,00"
          />
        </label>
        <PrimaryBtn type="button" onClick={() => onConcluir(ordem.id, valor)}>
          Serviço concluído
        </PrimaryBtn>
      </ConcludeRow>
    </ReqCard>
  );
}

export function RequisicoesPage() {
  const { produtos } = useProdutos();
  const { podePularCodigoFuncionario } = useSessao();
  const alertasEstoque = useMemo(
    () => listarProdutosEstoqueBaixo(produtos).length,
    [produtos],
  );
  const { ordens, concluirRequisicao } = useAtendimento();
  const [conclusaoPendente, setConclusaoPendente] = useState<{
    id: string;
    valor: string;
  } | null>(null);

  const aguardando = useMemo(
    () => ordens.filter((o) => AGUARDANDO.includes(o.status)),
    [ordens],
  );

  const concluidos = useMemo(
    () =>
      ordens
        .filter((o) => o.status === "concluido")
        .sort((a, b) => {
          const ta = a.concluidoEm ? new Date(a.concluidoEm).getTime() : 0;
          const tb = b.concluidoEm ? new Date(b.concluidoEm).getTime() : 0;
          return tb - ta;
        }),
    [ordens],
  );

  const handleConcluir = (id: string, valor: string) => {
    setConclusaoPendente({ id, valor });
  };

  const pularCodigoComoAdmin = () => {
    if (!conclusaoPendente) return;
    concluirRequisicao(
      conclusaoPendente.id,
      conclusaoPendente.valor || undefined,
    );
    setConclusaoPendente(null);
  };

  const confirmarMecanico = (funcionario: Funcionario) => {
    if (!conclusaoPendente) return;
    const nome = formatarNomeFuncionario(
      funcionario.nome,
      funcionario.sobrenome,
    );
    concluirRequisicao(conclusaoPendente.id, conclusaoPendente.valor || undefined, {
      codigo: funcionario.codigoServico,
      nome,
    });
    setConclusaoPendente(null);
  };

  const linhasRelatorio = useCallback(
    () =>
      concluidos.map((ordem) => [
        ordem.servicoNaMoto,
        ordem.clienteNome,
        `${ordem.motoMarca} ${ordem.motoModelo}`,
        ordem.produtoNome ?? "—",
        ordem.produtoCodigo ?? "—",
        ordem.concluidoEm ? formatarDataBr(ordem.concluidoEm) : "—",
        ordem.concluidoEm ? formatarHoraBr(ordem.concluidoEm) : "—",
        ordem.valorTotal ?? ordem.valorServico ?? "—",
        ordem.atendenteCodigo ?? "—",
        ordem.atendenteNome ?? ordem.atendente ?? "—",
        ordem.mecanicoCodigo ?? "—",
        ordem.mecanicoNome ?? "—",
        ordem.observacao ?? "—",
      ]),
    [concluidos],
  );

  const exportarCsv = useCallback(() => {
    if (concluidos.length === 0) return;

    const escape = (value: string) => {
      const text = String(value).replace(/"/g, '""');
      return /[",\n]/.test(text) ? `"${text}"` : text;
    };

    const csv = [
      COLUNAS_RELATORIO.join(","),
      ...linhasRelatorio().map((row) => row.map(escape).join(",")),
    ].join("\n");

    const blob = new Blob(["\ufeff", csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `jb-motos-servicos-concluidos-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [concluidos.length, linhasRelatorio]);

  const exportarPdf = useCallback(() => {
    if (concluidos.length === 0) return;

    exportReportPdf({
      title: "Relatório — serviços concluídos",
      fileName: `jb-motos-servicos-concluidos-${Date.now()}`,
      columns: COLUNAS_RELATORIO,
      rows: linhasRelatorio(),
    });
  }, [concluidos.length, linhasRelatorio]);

  return (
    <Page>
      <PageHeader>
        <h1>Requisições</h1>
        <p>
          Serviços enviados pelo{" "}
          <Link to={adminRoutes.cadastroAtendimento}>Atendimento</Link>. O
          mecânico conclui aqui; o relatório registra data, horário e valor.
          Também aparecem em <Link to={adminRoutes.servicos}>Serviços</Link>.
        </p>
      </PageHeader>

      {alertasEstoque > 0 && (
        <AlertBanner>
          Alerta de estoque: {alertasEstoque} produto(s) com estoque baixo.{" "}
          <Link to={adminRoutes.estoqueBaixo}>Ver relatório</Link>
        </AlertBanner>
      )}

      <SummaryGrid>
        <SummaryCard>
          <span>Aguardando / em andamento</span>
          <strong>{aguardando.length}</strong>
        </SummaryCard>
        <SummaryCard>
          <span>Serviços concluídos</span>
          <strong>{concluidos.length}</strong>
        </SummaryCard>
        <SummaryCard>
          <span>Total de requisições</span>
          <strong>{ordens.length}</strong>
        </SummaryCard>
      </SummaryGrid>

      <Panel>
        <PanelHead>
          <h2>Em espera — oficina</h2>
          <p>
            Ao concluir, informe o código do mecânico (ID) para registrar quem
            finalizou. O administrador pode simular com código de teste ou
            concluir sem código.
          </p>
        </PanelHead>
        {aguardando.length === 0 ? (
          <EmptyState>
            Nenhuma requisição aguardando. Abra uma ordem em Cadastros →
            Atendimento.
          </EmptyState>
        ) : (
          <WaitingGrid>
            {aguardando.map((ordem) => (
              <ReqCardAguardando
                key={ordem.id}
                ordem={ordem}
                onConcluir={handleConcluir}
              />
            ))}
          </WaitingGrid>
        )}
      </Panel>

      <Panel>
        <PanelHead>
          <PanelHeadText>
            <h2>Relatório — serviços concluídos</h2>
            <p>Histórico com data, horário e valor informado na conclusão.</p>
          </PanelHeadText>
          <ExportActions>
            <ExportBtn
              type="button"
              disabled={concluidos.length === 0}
              onClick={exportarCsv}
            >
              Exportar CSV
            </ExportBtn>
            <ExportBtn
              type="button"
              disabled={concluidos.length === 0}
              onClick={exportarPdf}
            >
              Relatório PDF
            </ExportBtn>
          </ExportActions>
        </PanelHead>
        {concluidos.length === 0 ? (
          <EmptyState>
            Ainda não há serviços concluídos nesta sessão.
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Serviço na moto</th>
                <th>Cliente / Moto</th>
                <th>Peça</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {concluidos.map((ordem) => (
                <tr key={ordem.id}>
                  <td>
                    <strong>{ordem.servicoNaMoto}</strong>
                    {ordem.observacao && (
                      <>
                        <br />
                        <small>{ordem.observacao}</small>
                      </>
                    )}
                  </td>
                  <td>
                    {ordem.clienteNome}
                    <br />
                    <small>
                      {ordem.motoMarca} {ordem.motoModelo}
                    </small>
                  </td>
                  <td>{ordem.produtoNome ?? "—"}</td>
                  <td>
                    {ordem.concluidoEm
                      ? formatarDataBr(ordem.concluidoEm)
                      : formatarDataBr(ordem.solicitadoEm)}
                  </td>
                  <td>
                    {ordem.concluidoEm
                      ? formatarHoraBr(ordem.concluidoEm)
                      : "—"}
                  </td>
                  <td>
                    <ValorDestaque>
                      {ordem.valorTotal ?? ordem.valorServico ?? "—"}
                    </ValorDestaque>
                  </td>
                  <td>
                    <StatusBadge status={ordem.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Panel>

      <CodigoFuncionarioModal
        open={conclusaoPendente !== null}
        titulo="Código do mecânico"
        descricao={
          podePularCodigoFuncionario
            ? "Informe o código do mecânico que concluiu o serviço — ou registre só como administrador."
            : "Informe seu código de serviço para registrar quem concluiu este serviço."
        }
        rotuloCampo={
          podePularCodigoFuncionario
            ? "Código do mecânico"
            : "Seu código de serviço"
        }
        dicaTeste={
          podePularCodigoFuncionario ? "Teste: 2001 — Carlos (mecânico)" : undefined
        }
        perfis={["mecanico"]}
        permitirPularComoAdmin={podePularCodigoFuncionario}
        onPularComoAdmin={pularCodigoComoAdmin}
        rotuloPularAdmin="Concluir como administrador (sem código)"
        onConfirm={confirmarMecanico}
        onCancel={() => setConclusaoPendente(null)}
      />
    </Page>
  );
}
