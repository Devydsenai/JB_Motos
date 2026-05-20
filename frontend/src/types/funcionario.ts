/** Perfis cadastráveis no CRH (funcionários da loja) */
export type PerfilFuncionario = "atendente" | "mecanico";

export type StatusRh =
  | "ativo"
  | "ferias"
  | "gestante"
  | "acidente"
  | "aviso_previo"
  | "afastado"
  | "demitido";

export type Funcionario = {
  id: string;
  /** ID de serviço (4–6 dígitos) — atendente ou mecânico */
  codigoServico: string;
  nome: string;
  sobrenome: string;
  email: string;
  /** Foto do crachá (data URL) */
  fotoUrl: string;
  cpf: string;
  /** Mock — com backend usar hash */
  senha: string;
  perfil: PerfilFuncionario;
  salarioBruto: string;
  dataAdmissao: string;
  dataDemissao: string;
  motivoDemissao: string;
  feriasInicio: string;
  feriasFim: string;
  cnh: string;
  cnhValidade: string;
  /** Dia do mês (1–28) — controle interno RH / CLT mulher */
  diaCicloMenstrual: string;
  gestante: boolean;
  dataPrevisaoParto: string;
  acidente: boolean;
  acidenteData: string;
  acidenteDescricao: string;
  avisoPrevio: boolean;
  avisoPrevioInicio: string;
  avisoPrevioFim: string;
  statusRh: StatusRh;
  ativo: boolean;
};
