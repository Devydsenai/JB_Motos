import { z } from "zod";

const rhFields = {
  codigoServico: z.string().regex(/^\d{4,6}$/, "Código de serviço: 4 a 6 dígitos").optional(),
  sobrenome: z.string().max(120).optional(),
  fotoUrl: z.string().optional(),
  cpf: z.string().max(14).optional(),
  salarioBruto: z.coerce.number().min(0).optional(),
  dataAdmissao: z.string().optional(),
  dataDemissao: z.string().optional(),
  motivoDemissao: z.string().max(255).optional(),
  feriasInicio: z.string().optional(),
  feriasFim: z.string().optional(),
  cnh: z.string().max(20).optional(),
  cnhValidade: z.string().optional(),
  diaCicloMenstrual: z.coerce.number().min(1).max(28).optional(),
  gestante: z.boolean().optional(),
  dataPrevisaoParto: z.string().optional(),
  acidente: z.boolean().optional(),
  acidenteData: z.string().optional(),
  acidenteDescricao: z.string().optional(),
  avisoPrevio: z.boolean().optional(),
  avisoPrevioInicio: z.string().optional(),
  avisoPrevioFim: z.string().optional(),
  statusRh: z
    .enum(["ATIVO", "FERIAS", "GESTANTE", "ACIDENTE", "AVISO_PREVIO", "AFASTADO", "DEMITIDO"])
    .optional(),
};

export const createUserSchema = z.object({
  body: z.object({
    nome: z.string().min(2, "Nome é obrigatório").max(120),
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(6, "Senha precisa ter ao menos 6 caracteres"),
    role: z.enum(["ATENDENTE", "MECANICO"]),
    telefone: z.string().optional(),
    ...rhFields,
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    nome: z.string().min(2).max(120).optional(),
    telefone: z.string().optional(),
    ativo: z.boolean().optional(),
    ...rhFields,
  }),
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    role: z.enum(["ATENDENTE", "MECANICO", "PROPRIETARIO"]).optional(),
    ativo: z.coerce.boolean().optional(),
    q: z.string().optional(),
  }),
});

export const lookupCodigoSchema = z.object({
  params: z.object({
    codigo: z.string().regex(/^\d{4,6}$/),
  }),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>["body"];
export type UpdateUserDTO = z.infer<typeof updateUserSchema>["body"];
