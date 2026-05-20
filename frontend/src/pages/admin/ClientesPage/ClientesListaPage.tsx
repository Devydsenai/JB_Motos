import { Text } from "@components/atoms/Text";
import { useAtendimento } from "@/contexts/AtendimentoContext";
import { Banner, Card, Page, Table } from "./ClientesPage.styles";

function formatarData(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("pt-BR");
}

export function ClientesListaPage() {
  const { clientes } = useAtendimento();

  return (
    <Page>
      <div>
        <Text as="h1" variant="h2" weight="bold">
          Clientes cadastrados
        </Text>
        <Text variant="body" color="muted" style={{ marginTop: "0.35rem" }}>
          Clientes da loja e cadastrados no balcão pelo atendente
        </Text>
      </div>

      <Banner>
        {clientes.length} cliente(s) no sistema (mock + cadastros do
        atendimento). Com o backend, sincroniza com a loja online.
      </Banner>

      <Card>
        <Table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Contato</th>
              <th>Moto</th>
              <th>Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>
                  {c.email}
                  <br />
                  <Text as="span" variant="caption" color="muted">
                    {c.telefone}
                  </Text>
                </td>
                <td>
                  {c.motoMarca} {c.motoModelo}
                </td>
                <td>{formatarData(c.cadastradoEm)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Page>
  );
}
