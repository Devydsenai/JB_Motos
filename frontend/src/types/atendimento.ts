import type { StatusSolicitacao } from "@/data/mockClientes";

export type OrigemOrdem = "loja_online" | "balcao_atendente";

/** Serviço/peça extra realizada na oficina ao avançar a OS */
export type ServicoAdicionalOficina = {
  produtoId: string;
  produtoCodigo: string;
  produtoNome: string;
  servicoRealizado: string;
  registradoEm: string;
};

export type ClienteLoja = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  motoMarca: string;
  motoModelo: string;
  cadastradoEm: string;
};

export type OrdemServico = {
  id: string;
  clienteId: string;
  clienteNome: string;
  motoMarca: string;
  motoModelo: string;
  produtoId?: string;
  produtoCodigo?: string;
  produtoNome?: string;
  tipo: "peca" | "servico";
  /** O que será feito na moto (definido no atendimento) */
  servicoNaMoto: string;
  descricao: string;
  solicitadoEm: string;
  status: StatusSolicitacao;
  observacao?: string;
  origem: OrigemOrdem;
  /** @deprecated use atendenteNome */
  atendente?: string;
  /** Código do atendente que enviou (balcão) */
  atendenteCodigo?: string;
  atendenteNome?: string;
  /** Código do mecânico que assumiu/concluiu */
  mecanicoCodigo?: string;
  mecanicoNome?: string;
  estoqueNoMomento?: number;
  /** Valor previsto (peça + serviço) */
  valorServico?: string;
  /** Preenchido ao concluir na tela Requisições */
  concluidoEm?: string;
  valorTotal?: string;
  /** Oficina informou se houve serviço além do solicitado */
  teveServicoAdicionalOficina?: boolean;
  /** Itens extras registrados na área Serviços */
  servicosAdicionais?: ServicoAdicionalOficina[];
};
