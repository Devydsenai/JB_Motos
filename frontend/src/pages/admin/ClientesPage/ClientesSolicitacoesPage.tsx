import { Text } from "@components/atoms/Text";
import { StatusBadge } from "@components/molecules/StatusBadge";
import { statusLabels } from "@/data/mockClientes";
import { useAtendimento } from "@/contexts/AtendimentoContext";
import { Banner, Card, Page, Table } from "./ClientesPage.styles";

function formatarData(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR");
}

const tipoLabel = { peca: "Peça", servico: "Serviço" } as const;

export function ClientesSolicitacoesPage() {
  const { ordens } = useAtendimento();
  const pendentes = ordens.filter((s) => s.status === "pendente").length;
  const emEspera = ordens.filter((s) => s.status === "em_espera").length;

  return (
    <Page>
      <div>
        <Text as="h1" variant="h2" weight="bold">
          Solicitações dos clientes
        </Text>
        <Text variant="body" color="muted" style={{ marginTop: "0.35rem" }}>
          Pedidos da loja online e ordens abertas no balcão
        </Text>
      </div>

      <Banner>
        Loja aberta de <strong>segunda a sexta</strong>. Solicitações no sábado
        ou domingo ficam <strong>pendentes</strong> até o próximo dia útil.{" "}
        {pendentes > 0 && `(${pendentes} pendente(s) · ${emEspera} em espera)`}
      </Banner>

      <Card>
        <Table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Data</th>
              <th>Status</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            {ordens.map((s) => (
              <tr key={s.id}>
                <td>{s.clienteNome}</td>
                <td>{tipoLabel[s.tipo]}</td>
                <td>{s.descricao}</td>
                <td>{formatarData(s.solicitadoEm)}</td>
                <td>
                  <StatusBadge status={s.status} />
                </td>
                <td>
                  <Text as="span" variant="caption" color="muted">
                    {s.observacao ?? "—"}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card>
        <Text variant="label" color="muted" weight="semibold">
          Legenda de status
        </Text>
        <Text variant="caption" color="muted" style={{ marginTop: "0.5rem" }}>
          {Object.entries(statusLabels).map(([k, v]) => (
            <span key={k}>
              <strong>{v}</strong> ·{" "}
            </span>
          ))}
          O mecânico atualiza em Serviços.
        </Text>
      </Card>
    </Page>
  );
}
