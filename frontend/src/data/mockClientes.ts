/** Dados de demonstração — substituir por API do backend */

export type StatusSolicitacao =
  | "pendente"
  | "em_espera"
  | "atendido"
  | "concluido";

export type Cliente = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  motoMarca: string;
  motoModelo: string;
  cadastradoEm: string;
};

export type SolicitacaoCliente = {
  id: string;
  clienteId: string;
  clienteNome: string;
  tipo: "peca" | "servico";
  descricao: string;
  solicitadoEm: string;
  status: StatusSolicitacao;
  observacao?: string;
};

export const clientesMock: Cliente[] = [
  {
    id: "c1",
    nome: "João Silva",
    email: "joao@email.com",
    telefone: "(11) 98765-4321",
    motoMarca: "Honda",
    motoModelo: "CG 160",
    cadastradoEm: "2026-05-10",
  },
  {
    id: "c2",
    nome: "Maria Santos",
    email: "maria@email.com",
    telefone: "(11) 91234-5678",
    motoMarca: "Yamaha",
    motoModelo: "Fazer 250",
    cadastradoEm: "2026-05-14",
  },
  {
    id: "c3",
    nome: "Pedro Oliveira",
    email: "pedro@email.com",
    telefone: "(11) 99876-5432",
    motoMarca: "Honda",
    motoModelo: "Biz 125",
    cadastradoEm: "2026-05-17",
  },
];

export const solicitacoesMock: SolicitacaoCliente[] = [
  {
    id: "s1",
    clienteId: "c1",
    clienteNome: "João Silva",
    tipo: "peca",
    descricao: "Kit relação CG 160",
    solicitadoEm: "2026-05-16",
    status: "pendente",
    observacao: "Solicitado no sábado — loja fecha fim de semana",
  },
  {
    id: "s2",
    clienteId: "c1",
    clienteNome: "João Silva",
    tipo: "servico",
    descricao: "Revisão completa + troca de óleo",
    solicitadoEm: "2026-05-12",
    status: "concluido",
  },
  {
    id: "s3",
    clienteId: "c2",
    clienteNome: "Maria Santos",
    tipo: "servico",
    descricao: "Freio dianteiro rangendo",
    solicitadoEm: "2026-05-18",
    status: "em_espera",
    observacao: "Aguardando peça em estoque",
  },
  {
    id: "s4",
    clienteId: "c3",
    clienteNome: "Pedro Oliveira",
    tipo: "peca",
    descricao: "Pneu traseiro 130/70-17",
    solicitadoEm: "2026-05-17",
    status: "atendido",
    observacao: "Cliente deve retirar e pagar na loja",
  },
  {
    id: "s5",
    clienteId: "c2",
    clienteNome: "Maria Santos",
    tipo: "peca",
    descricao: "Vela de ignição",
    solicitadoEm: "2026-05-18",
    status: "pendente",
  },
];

export const statusLabels: Record<StatusSolicitacao, string> = {
  pendente: "Pendente",
  em_espera: "Em espera",
  atendido: "Atendido",
  concluido: "Concluído",
};
