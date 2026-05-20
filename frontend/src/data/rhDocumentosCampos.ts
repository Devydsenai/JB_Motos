/** Estrutura dos campos da rescisão (exportação CSV / preenchimento PDF) */
export const camposRescisaoCsv: { chave: string; rotulo: string }[] = [
  { chave: "empresa", rotulo: "Empresa" },
  { chave: "nome_completo", rotulo: "Nome completo" },
  { chave: "cpf", rotulo: "CPF" },
  { chave: "email", rotulo: "E-mail" },
  { chave: "perfil", rotulo: "Função" },
  { chave: "data_admissao", rotulo: "Data de admissão" },
  { chave: "data_demissao", rotulo: "Data de demissão" },
  { chave: "motivo_demissao", rotulo: "Motivo da demissão" },
  { chave: "salario_bruto", rotulo: "Salário bruto" },
  { chave: "tempo_trabalho", rotulo: "Tempo de trabalho" },
  { chave: "ferias_inicio", rotulo: "Férias — início" },
  { chave: "ferias_fim", rotulo: "Férias — fim" },
  { chave: "cnh", rotulo: "CNH" },
  { chave: "cnh_validade", rotulo: "Validade CNH" },
  { chave: "gestante", rotulo: "Gestante" },
  { chave: "acidente", rotulo: "Acidente de trabalho" },
  { chave: "aviso_previo", rotulo: "Aviso prévio" },
  { chave: "aviso_previo_inicio", rotulo: "Aviso prévio — início" },
  { chave: "aviso_previo_fim", rotulo: "Aviso prévio — fim" },
  { chave: "status_rh", rotulo: "Status RH" },
];

export const checklistRescisao: string[] = [
  "Termo de rescisão do contrato de trabalho",
  "TRCT — Termo de Rescisão do Contrato de Trabalho",
  "Extrato do FGTS",
  "Guia para saque do FGTS",
  "Seguro-desemprego (quando aplicável)",
  "Atestado de saúde ocupacional demissional",
  "Comprovante de entrega de EPI / uniforme",
  "Baixa na CTPS (quando aplicável)",
];
