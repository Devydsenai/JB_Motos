/** Dono/administrador — não passa pelo CRH (mock até login no backend) */
export type AdministradorSistema = {
  id: string;
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  empresa: string;
  cargo: string;
  fotoUrl: string;
};

export const administradorMock: AdministradorSistema = {
  id: "admin-001",
  nome: "João",
  sobrenome: "Barbosa",
  email: "admin@jbmotos.com",
  telefone: "(11) 98765-4321",
  empresa: "JB Motos",
  cargo: "Dono / Administrador",
  fotoUrl: "",
};
