import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clientesMock, solicitacoesMock } from "@/data/mockClientes";
import type {
  ClienteLoja,
  OrdemServico,
  ServicoAdicionalOficina,
} from "@/types/atendimento";

const STORAGE_CLIENTES = "jb-motos-clientes";
const STORAGE_ORDENS = "jb-motos-ordens-servico";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeOrdem(raw: OrdemServico): OrdemServico {
  const atendenteNome = raw.atendenteNome ?? raw.atendente;
  return {
    ...raw,
    servicoNaMoto: raw.servicoNaMoto || raw.descricao || "Serviço",
    atendenteNome,
    atendente: atendenteNome,
  };
}

export type IdentificacaoFuncionario = {
  codigo: string;
  nome: string;
};

function mapLegacySolicitacoes(): OrdemServico[] {
  return solicitacoesMock.map((s) => {
    const cliente = clientesMock.find((c) => c.id === s.clienteId);
    return normalizeOrdem({
      id: s.id,
      clienteId: s.clienteId,
      clienteNome: s.clienteNome,
      motoMarca: cliente?.motoMarca ?? "—",
      motoModelo: cliente?.motoModelo ?? "—",
      tipo: s.tipo,
      servicoNaMoto: s.descricao,
      descricao: s.descricao,
      solicitadoEm: s.solicitadoEm,
      status: s.status,
      observacao: s.observacao,
      origem: "loja_online",
    });
  });
}

function readClientes(): ClienteLoja[] {
  try {
    const raw = localStorage.getItem(STORAGE_CLIENTES);
    const byId = new Map<string, ClienteLoja>();
    for (const c of clientesMock) {
      byId.set(c.id, c);
    }
    if (!raw) {
      return Array.from(byId.values());
    }
    const parsed = JSON.parse(raw) as ClienteLoja[];
    if (Array.isArray(parsed)) {
      for (const c of parsed) {
        if (c?.id && c?.nome) {
          byId.set(c.id, c);
        }
      }
    }
    return Array.from(byId.values());
  } catch {
    return [...clientesMock];
  }
}

function readOrdens(): OrdemServico[] {
  try {
    const raw = localStorage.getItem(STORAGE_ORDENS);
    if (!raw) return mapLegacySolicitacoes();
    const parsed = JSON.parse(raw) as OrdemServico[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed.map(normalizeOrdem)
      : mapLegacySolicitacoes();
  } catch {
    return mapLegacySolicitacoes();
  }
}

export type NovoClienteInput = Omit<ClienteLoja, "id" | "cadastradoEm">;

export type NovaOrdemInput = Omit<
  OrdemServico,
  "id" | "solicitadoEm" | "status" | "origem"
> & {
  origem?: OrdemServico["origem"];
  status?: OrdemServico["status"];
};

type AtendimentoContextValue = {
  clientes: ClienteLoja[];
  ordens: OrdemServico[];
  buscarClientes: (
    termo: string,
    incluirTodosSemTermo?: boolean,
  ) => ClienteLoja[];
  cadastrarCliente: (dados: NovoClienteInput) => ClienteLoja;
  criarOrdemServico: (dados: NovaOrdemInput) => OrdemServico;
  atualizarStatusOrdem: (id: string, status: OrdemServico["status"]) => void;
  concluirRequisicao: (
    id: string,
    valorTotal?: string,
    mecanico?: IdentificacaoFuncionario,
  ) => void;
  registrarMecanicoNaOrdem: (
    id: string,
    mecanico: IdentificacaoFuncionario,
  ) => void;
  registrarAvancoOficina: (
    id: string,
    dados: {
      teveServicoAdicional: boolean;
      servicoAdicional?: ServicoAdicionalOficina;
      proximoStatus: OrdemServico["status"];
    },
  ) => OrdemServico | null;
};

const AtendimentoContext = createContext<AtendimentoContextValue | null>(null);

export function AtendimentoProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<ClienteLoja[]>(readClientes);
  const [ordens, setOrdens] = useState<OrdemServico[]>(readOrdens);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLIENTES, JSON.stringify(clientes));
    } catch {
      /* ignore */
    }
  }, [clientes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ORDENS, JSON.stringify(ordens));
    } catch {
      /* ignore */
    }
  }, [ordens]);

  const buscarClientes = useCallback(
    (termo: string, incluirTodosSemTermo = false) => {
      const t = termo.trim().toLowerCase();
      if (!t) {
        return incluirTodosSemTermo
          ? [...clientes].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
          : [];
      }
      return clientes
        .filter(
          (c) =>
            c.nome.toLowerCase().includes(t) ||
            c.telefone.replace(/\D/g, "").includes(t.replace(/\D/g, "")) ||
            c.email.toLowerCase().includes(t) ||
            `${c.motoMarca} ${c.motoModelo}`.toLowerCase().includes(t),
        )
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    },
    [clientes],
  );

  const cadastrarCliente = useCallback((dados: NovoClienteInput) => {
    const novo: ClienteLoja = {
      ...dados,
      id: `c-${Date.now()}`,
      cadastradoEm: todayIso(),
    };
    setClientes((atuais) => [novo, ...atuais]);
    return novo;
  }, []);

  const criarOrdemServico = useCallback((dados: NovaOrdemInput) => {
    const origem = dados.origem ?? "balcao_atendente";
    const ordem: OrdemServico = {
      ...dados,
      id: `os-${Date.now()}`,
      solicitadoEm: todayIso(),
      status:
        dados.status ??
        (origem === "balcao_atendente" ? "em_espera" : "pendente"),
      origem,
    };
    setOrdens((atuais) => [ordem, ...atuais]);
    return ordem;
  }, []);

  const concluirRequisicao = useCallback(
    (id: string, valorTotal?: string, mecanico?: IdentificacaoFuncionario) => {
      const agora = new Date().toISOString();
      setOrdens((atuais) =>
        atuais.map((o) =>
          o.id === id
            ? {
                ...o,
                status: "concluido",
                concluidoEm: agora,
                valorTotal:
                  valorTotal?.trim() || o.valorServico || o.valorTotal,
                mecanicoCodigo: mecanico?.codigo ?? o.mecanicoCodigo,
                mecanicoNome: mecanico?.nome ?? o.mecanicoNome,
              }
            : o,
        ),
      );
    },
    [],
  );

  const registrarMecanicoNaOrdem = useCallback(
    (id: string, mecanico: IdentificacaoFuncionario) => {
      setOrdens((atuais) =>
        atuais.map((o) =>
          o.id === id
            ? {
                ...o,
                mecanicoCodigo: mecanico.codigo,
                mecanicoNome: mecanico.nome,
              }
            : o,
        ),
      );
    },
    [],
  );

  const atualizarStatusOrdem = useCallback(
    (id: string, status: OrdemServico["status"]) => {
      setOrdens((atuais) =>
        atuais.map((o) => (o.id === id ? { ...o, status } : o)),
      );
    },
    [],
  );

  const registrarAvancoOficina = useCallback(
    (
      id: string,
      dados: {
        teveServicoAdicional: boolean;
        servicoAdicional?: ServicoAdicionalOficina;
        proximoStatus: OrdemServico["status"];
      },
    ) => {
      let atualizada: OrdemServico | null = null;
      setOrdens((atuais) =>
        atuais.map((o) => {
          if (o.id !== id) return o;
          const extras = [...(o.servicosAdicionais ?? [])];
          if (dados.teveServicoAdicional && dados.servicoAdicional) {
            extras.push(dados.servicoAdicional);
          }
          atualizada = {
            ...o,
            status: dados.proximoStatus,
            teveServicoAdicionalOficina: dados.teveServicoAdicional,
            servicosAdicionais: extras,
            observacao: dados.teveServicoAdicional
              ? [
                  o.observacao,
                  `Oficina (+): ${dados.servicoAdicional?.servicoRealizado} (${dados.servicoAdicional?.produtoNome})`,
                ]
                  .filter(Boolean)
                  .join(" · ")
              : o.observacao,
          };
          return atualizada;
        }),
      );
      return atualizada;
    },
    [],
  );

  const value = useMemo(
    () => ({
      clientes,
      ordens,
      buscarClientes,
      cadastrarCliente,
      criarOrdemServico,
      atualizarStatusOrdem,
      concluirRequisicao,
      registrarMecanicoNaOrdem,
      registrarAvancoOficina,
    }),
    [
      clientes,
      ordens,
      buscarClientes,
      cadastrarCliente,
      criarOrdemServico,
      atualizarStatusOrdem,
      concluirRequisicao,
      registrarMecanicoNaOrdem,
      registrarAvancoOficina,
    ],
  );

  return (
    <AtendimentoContext.Provider value={value}>
      {children}
    </AtendimentoContext.Provider>
  );
}

export function useAtendimento() {
  const ctx = useContext(AtendimentoContext);
  if (!ctx) {
    throw new Error("useAtendimento deve ser usado dentro de AtendimentoProvider");
  }
  return ctx;
}
