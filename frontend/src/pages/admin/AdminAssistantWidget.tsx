import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Icon } from "@components/atoms/Icon";
import { useSessao } from "@/contexts/SessaoContext";
import {
  enviarMensagemAssistenteAdministrativo,
  type AssistenteAdministrativoResponse,
} from "@/services/assistenteAdministrativo";

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

function getReply(data: AssistenteAdministrativoResponse) {
  const checklist = data.checklist?.length
    ? `\n\nChecklist:\n${data.checklist.map((item) => `- ${item}`).join("\n")}`
    : "";
  return (
    data.reply ||
    "Posso ajudar com produtos, fornecedores, importação, financeiro, estoque ou serviços."
  ) + checklist;
}

export function AdminAssistantWidget() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nomeRegistroSistema, perfil } = useSessao();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    "Importar planilha",
    "Ver financeiro",
    "Serviços pendentes",
    "Estoque",
  ]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Olá! Sou o assistente administrativo da JB Motos. Posso ajudar com planilhas, produtos, fornecedores, estoque, financeiro e serviços.",
    },
  ]);

  const applyActions = (actions: AssistenteAdministrativoResponse["actions"] = []) => {
    for (const action of actions) {
      if (action.type === "navigate") {
        const route = action.payload?.route;
        if (typeof route === "string") navigate(route);
      }
    }
  };

  const sendMessage = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    setMessage("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", text: content }]);

    try {
      const data = await enviarMensagemAssistenteAdministrativo({
        usuario: nomeRegistroSistema,
        perfil,
        message: content,
        page: location.pathname,
      });

      setMessages((current) => [
        ...current,
        { role: "assistant", text: getReply(data) },
      ]);
      setQuickReplies(data.quickReplies ?? []);
      applyActions(data.actions);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            error instanceof Error
              ? error.message
              : "Não consegui chamar o assistente administrativo agora.",
        },
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
              <strong>Assistente Administrativo</strong>
              <span>JB Motos</span>
            </div>
            <button type="button" onClick={() => setOpen(false)}>
              ×
            </button>
          </PanelHeader>

          <Messages>
            {messages.map((item, index) => (
              <Bubble key={`${item.role}-${index}`} data-role={item.role}>
                {item.text}
              </Bubble>
            ))}
          </Messages>

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

          <Form onSubmit={handleSubmit}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Pergunte sobre importação, estoque..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !message.trim()}>
              {loading ? "..." : "Enviar"}
            </button>
          </Form>
        </Panel>
      )}

      <TriggerButton type="button" onClick={() => setOpen((value) => !value)}>
        <Icon name="robot" size={20} color="#fff" />
        <span>Admin IA</span>
      </TriggerButton>
    </WidgetRoot>
  );
}

const WidgetRoot = styled.div`
  position: fixed;
  right: 1.25rem;
  bottom: 1.25rem;
  z-index: 120;
`;

const TriggerButton = styled.button`
  min-width: 68px;
  height: 58px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, #c41e1e, #650000);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
  cursor: pointer;
  font-weight: 900;

  span {
    font-size: 0.68rem;
  }
`;

const Panel = styled.div`
  width: min(380px, calc(100vw - 2rem));
  margin-bottom: 0.75rem;
  overflow: hidden;
  border-radius: 18px;
  background: ${({ theme }) => (theme.mode === "light" ? "#fff" : "#111")};
  color: ${({ theme }) => (theme.mode === "light" ? "#111" : "#fff")};
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.38);
  border: 1px solid rgba(148, 163, 184, 0.22);
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

  span {
    font-size: 0.75rem;
    opacity: 0.85;
  }

  button {
    border: 0;
    background: transparent;
    color: #fff;
    font-size: 1.35rem;
    cursor: pointer;
  }
`;

const Messages = styled.div`
  max-height: 320px;
  padding: 1rem;
  display: grid;
  gap: 0.65rem;
  overflow-y: auto;
`;

const Bubble = styled.div`
  width: fit-content;
  max-width: 92%;
  white-space: pre-line;
  padding: 0.7rem 0.8rem;
  border-radius: 14px;
  font-size: 0.85rem;
  line-height: 1.45;
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
