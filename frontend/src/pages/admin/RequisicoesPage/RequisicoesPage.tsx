import { PagePlaceholder } from "@components/molecules/PagePlaceholder";
import { MOCK_ALERTAS_ESTOQUE } from "@/config/adminMenu";

export function RequisicoesPage() {
  return (
    <PagePlaceholder
      title="Requisições"
      description={`Demandas de peças (mecânico, atendente, cliente). Alerta mock: ${MOCK_ALERTAS_ESTOQUE} produto(s) com estoque baixo.`}
    />
  );
}
