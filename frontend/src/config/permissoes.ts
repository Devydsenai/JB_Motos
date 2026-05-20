/** Dono/administrador do sistema — não passa pelo CRH */
export type PerfilSistema = "dono" | "atendente" | "mecanico";

import type { PerfilFuncionario } from "@/types/funcionario";

export type { PerfilFuncionario };

/** Rotas/páginas que cada perfil pode acessar no admin */
export const permissoesPorPerfil: Record<PerfilSistema, string[]> = {
  dono: ["*"],
  atendente: [
    "dashboard",
    "estoque",
    "servicos",
    "requisicoes",
    "cadastros/atendimento",
    "clientes",
  ],
  mecanico: ["estoque", "servicos", "requisicoes"],
};

export const perfilSistemaLabels: Record<PerfilSistema, string> = {
  dono: "Dono / Administrador",
  atendente: "Atendente",
  mecanico: "Mecânico",
};

export const perfilSistemaDescricoes: Record<PerfilSistema, string> = {
  dono: "Proprietário: acesso total. Não é cadastrado no CRH — admite e demite pela área administrativa.",
  atendente:
    "Estoque, atendimento, serviços e requisições — sem financeiro nem administrativo.",
  mecanico: "Estoque, requisições e serviços — foco na oficina.",
};

export const perfilFuncionarioLabels: Record<PerfilFuncionario, string> = {
  atendente: "Atendente",
  mecanico: "Mecânico",
};

export const perfilFuncionarioDescricoes: Record<PerfilFuncionario, string> = {
  atendente: perfilSistemaDescricoes.atendente,
  mecanico: perfilSistemaDescricoes.mecanico,
};

/** Atendente/mecânico informam o próprio código; dono simula outro ou pula */
export function exigeCodigoFuncionario(perfil: PerfilSistema): boolean {
  return perfil !== "dono";
}
