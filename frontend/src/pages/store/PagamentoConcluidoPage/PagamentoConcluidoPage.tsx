import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  confirmPurchaseFromReturn,
  isMercadoPagoPaymentApproved,
  isMercadoPagoPaymentPending,
} from "@/utils/storePurchaseHistory";
import {
  Actions,
  Card,
  IconWrap,
  Message,
  Page,
  PrimaryBtn,
  SecondaryBtn,
  Title,
} from "./PagamentoConcluidoPage.styles";

export function PagamentoConcluidoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [ready, setReady] = useState(false);

  const collectionStatus = searchParams.get("collection_status");
  const status = searchParams.get("status");
  const externalReference = searchParams.get("external_reference");
  const preferenceId = searchParams.get("preference_id");
  const paymentId = searchParams.get("payment_id");

  const approved = isMercadoPagoPaymentApproved(collectionStatus, status);
  const pending = isMercadoPagoPaymentPending(collectionStatus, status);

  useEffect(() => {
    confirmPurchaseFromReturn({
      externalReference,
      preferenceId,
      paymentId,
      collectionStatus,
      status,
    });
    setReady(true);
  }, [collectionStatus, status, externalReference, preferenceId, paymentId]);

  const content = useMemo(() => {
    if (!ready) {
      return {
        icon: "…",
        title: "Confirmando pagamento…",
        message: "Aguarde um instante.",
      };
    }

    if (approved) {
      return {
        icon: "✓",
        title: "Pagamento concluído!",
        message:
          "Sua compra foi registrada no histórico da sua conta. O carrinho foi liberado para novos pedidos.",
      };
    }

    if (pending) {
      return {
        icon: "⏳",
        title: "Pagamento pendente",
        message:
          "Recebemos seu pedido. Assim que o PIX ou pagamento for confirmado, o status será atualizado no histórico.",
      };
    }

    return {
      icon: "✓",
      title: "Retorno do Mercado Pago",
      message:
        "Você voltou da tela de pagamento. Confira o histórico no carrinho para ver o status da compra.",
    };
  }, [approved, pending, ready]);

  return (
    <Page>
      <Card>
        <IconWrap>{content.icon}</IconWrap>
        <Title>{content.title}</Title>
        <Message>{content.message}</Message>
        <Actions>
          <PrimaryBtn type="button" onClick={() => navigate("/loja", { replace: true })}>
            Voltar para a loja
          </PrimaryBtn>
          <SecondaryBtn
            type="button"
            onClick={() => navigate("/loja/carrinho", { replace: true })}
          >
            Ver histórico no carrinho
          </SecondaryBtn>
        </Actions>
      </Card>
    </Page>
  );
}
