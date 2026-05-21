import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    nome: z.string().min(2, "Nome é obrigatório").max(120),
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(6, "Senha precisa ter ao menos 6 caracteres"),
    role: z.enum(["ATENDENTE", "MECANICO", "PROPRIETARIO"]),
    telefone: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    nome: z.string().min(2).max(120).optional(),
    telefone: z.string().optional(),
    ativo: z.boolean().optional(),
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

export type CreateUserDTO = z.infer<typeof createUserSchema>["body"];
export type UpdateUserDTO = z.infer<typeof updateUserSchema>["body"];
