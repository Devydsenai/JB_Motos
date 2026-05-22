import { useMemo, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "@components/atoms/Icon";
import { useAtendimento } from "@/contexts/AtendimentoContext";
import { readStoreAuth } from "@/services/authStorage";
import {
  enviarMensagemAssistenteCliente,
  type AssistenteClienteResponse,
} from "@/services/assistenteCliente";

const STORAGE_CART = "jb-motos-store-cart";
const STORAGE_SESSION = "jb-motos-assistente-cliente-session";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type ServiceRequestPayload = {
  clienteId?: string;
  clienteNome?: string;
  motoMarca?: string;
  motoModelo?: string;
  tipo?: "peca" | "servico";
  servicoNaMoto?: string;
  descricao?: string;
  observacao?: string;
  valorServico?: string;
};

type LocalService = {
  id: string;
  nome: string;
  precoServico: string;
  peca: string;
  precoPeca: string;
  keywords: string[];
};

const LOCAL_SERVICES: LocalService[] = [
  {
    id: "troca-oleo",
    nome: "Troca de óleo",
    precoServico: "R$ 35,00",
    peca: "Óleo Motor 10W30",
    precoPeca: "R$ 48,90",
    keywords: ["troca de oleo", "troca de óleo", "oleo", "óleo"],
  },
  {
    id: "pastilha-freio",
    nome: "Troca de pastilha de freio",
    precoServico: "R$ 60,00",
    peca: "Pastilha de Freio",
    precoPeca: "R$ 35,00",
    keywords: ["pastilha", "freio", "pastilha de freio"],
  },
  {
    id: "relacao",
    nome: "Troca de relação",
    precoServico: "R$ 90,00",
    peca: "Kit Relação CG 160",
    precoPeca: "R$ 142,50",
    keywords: ["relação", "relacao", "kit relação", "kit relacao"],
  },
  {
    id: "pneu",
    nome: "Troca de pneu",
    precoServico: "R$ 45,00",
    peca: "Pneu Traseiro 90/90",
    precoPeca: "R$ 189,90",
    keywords: ["pneu", "troca de pneu"],
  },
  {
    id: "revisao-completa",
    nome: "Revisão completa",
    precoServico: "A combinar",
    peca: "Peças conforme avaliação",
    precoPeca: "A confirmar",
    keywords: ["revisao", "revisão", "revisao completa", "revisão completa"],
  },
  {
    id: "diagnostico-eletrico",
    nome: "Diagnóstico elétrico",
    precoServico: "A combinar",
    peca: "Chicote, bateria ou lâmpadas conforme avaliação",
    precoPeca: "A confirmar",
    keywords: ["eletrica", "elétrica", "parte eletrica", "diagnostico eletrico", "luz", "farol", "bateria"],
  },
  {
    id: "limpeza-bico",
    nome: "Limpeza de bico injetor",
    precoServico: "A combinar",
    peca: "Produto de limpeza e vedação conforme necessidade",
    precoPeca: "A confirmar",
    keywords: ["bico", "bico injetor", "limpeza de bico", "injeção", "injecao"],
  },
  {
    id: "regulagem-valvula",
    nome: "Regulagem de válvulas",
    precoServico: "A combinar",
    peca: "Juntas ou componentes conforme avaliação",
    precoPeca: "A confirmar",
    keywords: ["valvula", "válvula", "valvulas", "válvulas", "regulagem"],
  },
  {
    id: "troca-bateria",
    nome: "Troca de bateria",
    precoServico: "A combinar",
    peca: "Bateria compatível com a moto",
    precoPeca: "A confirmar",
    keywords: ["bateria", "troca de bateria", "moto nao liga", "moto não liga"],
  },
  {
    id: "freio-completo",
    nome: "Revisão do sistema de freio",
    precoServico: "A combinar",
    peca: "Pastilha, lona, fluido ou disco conforme avaliação",
    precoPeca: "A confirmar",
    keywords: ["freio", "freios", "fluido de freio", "lona", "disco"],
  },
  {
    id: "suspensao",
    nome: "Serviço de suspensão",
    precoServico: "A combinar",
    peca: "Retentores, óleo ou componentes conforme avaliação",
    precoPeca: "A confirmar",
    keywords: ["suspensao", "suspensão", "amortecedor", "bengala", "retentor"],
  },
  {
    id: "embreagem",
    nome: "Serviço de embreagem",
    precoServico: "A combinar",
    peca: "Discos, cabo ou kit de embreagem conforme avaliação",
    precoPeca: "A confirmar",
    keywords: ["embreagem", "cabo de embreagem", "disco de embreagem"],
  },
  {
    id: "carburador",
    nome: "Limpeza e regulagem de carburador",
    precoServico: "A combinar",
    peca: "Reparo ou juntas conforme avaliação",
    precoPeca: "A confirmar",
    keywords: ["carburador", "limpeza carburador", "regular carburador"],
  },
  {
    id: "transmissao",
    nome: "Serviço de transmissão",
    precoServico: "A combinar",
    peca: "Corrente, coroa e pinhão conforme avaliação",
    precoPeca: "A confirmar",
    keywords: ["transmissao", "transmissão", "corrente", "coroa", "pinhao", "pinhão"],
  },
];

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findService(text: string) {
  const normalized = normalizeText(text);
  return LOCAL_SERVICES.find((service) =>
    service.keywords.some((keyword) => normalized.includes(normalizeText(keyword))),
  );
}

function isConfirmation(text: string) {
  const normalized = normalizeText(text);
  return ["confirmo", "quero", "pode enviar", "pode marcar", "sim", "ok"].some(
    (word) => normalized.includes(word),
  );
}

function isGenericWelcome(reply: string) {
  const normalized = normalizeText(reply);
  return (
    normalized.includes("sou o assistente da jb motos") &&
    normalized.includes("ofertas") &&
    normalized.includes("servicos")
  );
}

/** n8n às vezes devolve sempre a oferta de óleo, mesmo em "Cancelar" ou "oi". */
function isN8nStuckOnOil(reply: string, userMessage: string) {
  const replyN = normalizeText(reply);
  const userN = normalizeText(userMessage);
  const userAskedOil =
    userN.includes("oleo") ||
    userN.includes("troca de oleo") ||
    userN.includes("confirmo troca");
  if (userAskedOil) return false;
  return (
    replyN.includes("troca de oleo") &&
    (replyN.includes("adicionar ao carrinho") || replyN.includes("deseja adicionar"))
  );
}

function getSessionId() {
  try {
    const current = localStorage.getItem(STORAGE_SESSION);
    if (current) return current;
    const next = `cliente-${Date.now()}`;
    localStorage.setItem(STORAGE_SESSION, next);
    return next;
  } catch {
    return "cliente-anonimo";
  }
}

function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_CART);
    const parsed = raw ? (JSON.parse(raw) as unknown[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getLoggedCustomer() {
  return readStoreAuth()?.customer ?? null;
}

function getReply(data: AssistenteClienteResponse) {
  return (
    data.reply ||
    "Recebi sua mensagem. Posso ajudar com ofertas, serviços, pagamento ou carrinho."
  );
}

export function AssistenteClienteWidget() {
  const navigate = useNavigate();
  const location = useLocation();
  const { criarOrdemServico } = useAtendimento();
  const sessionId = useMemo(getSessionId, []);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingService, setPendingService] = useState<LocalService | null>(null);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "Ver ofertas",
    "Ver serviços",
    "Formas de pagamento",
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Olá! Sou o assistente da JB Motos. Como posso te ajudar?",
    },
  ]);

  const createServiceRequest = (payload: ServiceRequestPayload, announce = true) => {
    const customer = getLoggedCustomer();
    if (!customer) {
      setQuickReplies(["Entrar na minha conta", "Ver serviços", "Continuar conversa"]);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "Para enviar uma solicitação de serviço ao administrativo, preciso que você faça login na sua conta primeiro.",
        },
      ]);
      navigate("/loja/minha-conta", {
        state: {
          mensagem: "Entre na sua conta para solicitar serviços pelo assistente.",
          from: location.pathname,
        },
      });
      return null;
    }

    const ordem = criarOrdemServico({
      clienteId: payload.clienteId ?? customer.id,
      clienteNome: payload.clienteNome ?? customer.nome,
      motoMarca: payload.motoMarca ?? "A confirmar",
      motoModelo: payload.motoModelo ?? "A confirmar",
      tipo: payload.tipo ?? "servico",
      servicoNaMoto: payload.servicoNaMoto ?? "Serviço solicitado pelo chat",
      descricao:
        payload.descricao ??
        payload.servicoNaMoto ??
        "Solicitação criada pelo assistente da loja.",
      observacao:
        payload.observacao ??
        "Solicitação enviada automaticamente pelo assistente do cliente.",
      valorServico: payload.valorServico,
      origem: "loja_online",
      status: "pendente",
    });

    if (announce) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: `Enviei sua solicitação para o administrativo. Protocolo: ${ordem.id}.`,
        },
      ]);
    }
    return ordem.id;
  };

  const buildLocalServiceReply = (content: string) => {
    const selectedService = findService(content);
    const normalized = normalizeText(content);

    if (normalized.includes("entrar") || normalized.includes("minha conta")) {
      navigate("/loja/minha-conta", {
        state: {
          mensagem: "Entre na sua conta para continuar pelo assistente.",
          from: location.pathname,
        },
      });
      return "Certo. Vou te levar para a tela de login. Depois de entrar, volte ao chat para solicitar o serviço.";
    }

    if (normalized.includes("cancelar")) {
      setPendingService(null);
      setQuickReplies(["Ver serviços", "Ver ofertas", "Formas de pagamento"]);
      return "Tudo bem, cancelei essa solicitação. Posso te ajudar com outro serviço, ofertas ou formas de pagamento.";
    }

    if (
      normalized.includes("outros servico") ||
      normalized.includes("ver outros") ||
      normalized.includes("outra opcao")
    ) {
      setPendingService(null);
      setQuickReplies(LOCAL_SERVICES.map((service) => service.nome));
      return "Sem problema. Qual destes serviços você precisa?";
    }

    if (pendingService && isConfirmation(content)) {
      const protocol = createServiceRequest(
        {
          clienteId: sessionId,
          clienteNome: "Cliente da loja",
          tipo: "servico",
          servicoNaMoto: pendingService.nome,
          descricao: `Solicitação criada pelo assistente: ${pendingService.nome}. Peça sugerida: ${pendingService.peca}.`,
          observacao: `Peça sugerida: ${pendingService.peca} (${pendingService.precoPeca}).`,
          valorServico: pendingService.precoServico,
        },
        false,
      );
      if (!protocol) return "Para concluir esse pedido de serviço, entre na sua conta. Depois volte ao chat e confirme novamente.";
      setPendingService(null);
      setQuickReplies(["Ver serviços", "Ir para carrinho", "Continuar comprando"]);
      return `Perfeito. Solicitação enviada para o administrativo com o protocolo ${protocol}. A equipe vai conferir o serviço e a peça para sua moto.`;
    }

    if (selectedService) {
      if (!getLoggedCustomer()) {
        setPendingService(selectedService);
        setQuickReplies(["Entrar na minha conta", "Ver serviços", "Continuar conversa"]);
        return `Posso te explicar sobre ${selectedService.nome}. Para enviar essa solicitação ao administrativo, você precisa estar logado. Entre na sua conta e depois confirme o serviço pelo chat.`;
      }

      setPendingService(selectedService);
      setQuickReplies([`Confirmo ${selectedService.nome}`, "Ver outros serviços", "Cancelar"]);
      return `Entendi. Para ${selectedService.nome}, a JB Motos pode avaliar sua moto e separar a peça sugerida: ${selectedService.peca}. Serviço: ${selectedService.precoServico} + peça estimada: ${selectedService.precoPeca}. Deseja que eu envie essa solicitação para o administrativo?`;
    }

    if (normalized.includes("servico")) {
      setQuickReplies(LOCAL_SERVICES.map((service) => service.nome));
      return "Temos serviços como troca de óleo, pastilha de freio, relação e pneu. Me diga qual serviço você precisa para eu explicar e enviar ao administrativo.";
    }

    if (normalized.includes("pagamento") || normalized.includes("pix") || normalized.includes("cartao")) {
      setQuickReplies(["Ver serviços", "Ver ofertas", "Ir para carrinho"]);
      return "Hoje o pagamento ainda está em modo de teste: PIX, cartão, dinheiro ou pagamento no balcão. Quando o Mercado Pago for conectado, o checkout real abre nessa etapa.";
    }

    if (normalized.includes("oferta") || normalized.includes("promocao") || normalized.includes("promocao")) {
      setQuickReplies(["Óleo Motor 10W30", "Pastilha de Freio", "Capacete Pro Tork"]);
      return "Temos ofertas ativas como Óleo Motor 10W30, Pastilha de Freio e Capacete Pro Tork. Posso te ajudar a escolher uma ou enviar para o carrinho.";
    }

    if (normalized.includes("cartaz")) {
      setQuickReplies(["Revisão preventiva", "Promoções da semana", "Ver serviços"]);
      return "Os cartazes ativos são Revisão preventiva e Promoções da semana. Posso te levar para serviços ou ofertas.";
    }

    return null;
  };

  const applyActions = (actions: AssistenteClienteResponse["actions"] = []) => {
    let createdService = false;
    for (const action of actions) {
      if (action.type === "navigate") {
        const route = action.payload?.route;
        if (typeof route === "string") navigate(route);
      }

      if (action.type === "create_service_request") {
        const payload = (action.payload ?? {}) as ServiceRequestPayload;
        createServiceRequest(payload);
        createdService = true;
      }
    }
    return createdService;
  };

  const sendMessage = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    setError("");
    setMessage("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", text: content }]);

    const localFirst = buildLocalServiceReply(content);
    if (localFirst) {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: localFirst },
      ]);
      setLoading(false);
      return;
    }

    try {
      const data = await enviarMensagemAssistenteCliente({
        sessionId,
        message: content,
        page: location.pathname,
        cart: readCart(),
      });

      const reply = getReply(data);
      const createdByAction = applyActions(data.actions);

      let assistantText = reply;
      if (isN8nStuckOnOil(reply, content)) {
        assistantText =
          buildLocalServiceReply(content) ??
          "Olá! Posso ajudar com serviços, ofertas, pagamento ou carrinho. O que você precisa?";
        setQuickReplies(["Ver serviços", "Ver ofertas", "Formas de pagamento"]);
      } else if (isGenericWelcome(reply)) {
        const alt = buildLocalServiceReply(content);
        if (alt) assistantText = alt;
        else setQuickReplies(data.quickReplies ?? []);
      } else {
        setQuickReplies(data.quickReplies ?? []);
      }

      if (!createdByAction) {
        setMessages((current) => [
          ...current,
          { role: "assistant", text: assistantText },
        ]);
      }
    } catch (err) {
      const localReply = buildLocalServiceReply(content);
      if (localReply) {
        setMessages((current) => [
          ...current,
          { role: "assistant", text: localReply },
        ]);
        setLoading(false);
        return;
      }

      const msg =
        err instanceof Error
          ? err.message
          : "Não consegui chamar o assistente agora.";
      setError(msg);
      setMessages((current) => [
        ...current,
        { role: "assistant", text: msg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(message);
  };

  return (
    <WidgetRoot>
      {open && (
        <Panel>
          <PanelHeader>
            <div>
              <strong>Assistente JB Motos</strong>
              <span>Atendimento da loja</span>
            </div>
            <CloseButton type="button" onClick={() => setOpen(false)}>
              ×
            </CloseButton>
          </PanelHeader>

          <Messages>
            {messages.map((item, index) => (
              <Bubble key={`${item.role}-${index}`} data-role={item.role}>
                {item.text}
              </Bubble>
            ))}
          </Messages>

          {quickReplies.length > 0 && (
            <QuickReplies>
              {quickReplies.slice(0, 4).map((reply) => (
                <button
                  key={reply}
                  type="button"
                  disabled={loading}
                  onClick={() => void sendMessage(reply)}
                >
                  {reply}
                </button>
              ))}
            </QuickReplies>
          )}

          {error && <ErrorText>{error}</ErrorText>}

          <Form onSubmit={handleSubmit}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Digite sua dúvida..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !message.trim()}>
              {loading ? "..." : "Enviar"}
            </button>
          </Form>
        </Panel>
      )}

      <TriggerButton type="button" onClick={() => setOpen((value) => !value)}>
        <Icon name="chat-dots-fill" size={20} color="#fff" />
        <span>IA</span>
      </TriggerButton>
    </WidgetRoot>
  );
}

const WidgetRoot = styled.div`
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 80;
`;

const TriggerButton = styled.button`
  width: 58px;
  height: 58px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: linear-gradient(135deg, #e11d1d, #8b0000);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  font-weight: 900;

  span {
    font-size: 0.7rem;
  }
`;

const Panel = styled.div`
  width: min(360px, calc(100vw - 2rem));
  margin-bottom: 0.75rem;
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.42);
`;

const PanelHeader = styled.div`
  padding: 1rem;
  background: #c41e1e;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: grid;
    gap: 0.15rem;
  }

  strong {
    font-size: 0.95rem;
  }

  span {
    font-size: 0.75rem;
    opacity: 0.85;
  }
`;

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
`;

const Messages = styled.div`
  max-height: 300px;
  padding: 1rem;
  display: grid;
  gap: 0.65rem;
  overflow-y: auto;
`;

const Bubble = styled.div`
  width: fit-content;
  max-width: 88%;
  padding: 0.7rem 0.8rem;
  border-radius: 16px;
  font-size: 0.86rem;
  line-height: 1.4;
  background: ${({ theme }) =>
    theme.mode === "light" ? "#f3f4f6" : "rgba(255, 255, 255, 0.08)"};

  &[data-role="user"] {
    justify-self: end;
    background: #c41e1e;
    color: #fff;
  }
`;

const QuickReplies = styled.div`
  padding: 0 1rem 0.75rem;
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;

  button {
    border: 1px solid rgba(196, 30, 30, 0.35);
    background: rgba(196, 30, 30, 0.08);
    color: ${({ theme }) => (theme.mode === "light" ? "#991b1b" : "#ffb4b4")};
    border-radius: 999px;
    padding: 0.45rem 0.65rem;
    font-size: 0.75rem;
    font-weight: 800;
    cursor: pointer;
  }
`;

const ErrorText = styled.p`
  margin: 0 1rem 0.75rem;
  color: #ef4444;
  font-size: 0.78rem;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 0.85rem;
  border-top: 1px solid rgba(148, 163, 184, 0.25);

  input {
    flex: 1;
    min-width: 0;
    border: 1px solid rgba(148, 163, 184, 0.35);
    border-radius: 12px;
    padding: 0.75rem;
    background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#050505")};
    color: inherit;
    outline: none;
  }

  button {
    border: 0;
    border-radius: 12px;
    background: #c41e1e;
    color: #fff;
    padding: 0 0.85rem;
    font-weight: 900;
    cursor: pointer;

    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }
`;
