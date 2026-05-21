import { z } from "zod";

export const createClientSchema = z.object({
  body: z.object({
    nome: z.string().min(2, "Nome é obrigatório").max(120),
    telefone: z.string().min(8, "Telefone inválido").max(20),
    cpf: z.string().optional(),
    email: z.string().email("E-mail inválido").optional().or(z.literal("")),
    endereco: z.string().max(255).optional(),
    cidade: z.string().max(80).optional(),
    observacoes: z.string().optional(),
  }),
});

export const updateClientSchema = z.object({
  body: z.object({
    nome: z.string().min(2).max(120).optional(),
    telefone: z.string().min(8).max(20).optional(),
    cpf: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    endereco: z.string().max(255).optional(),
    cidade: z.string().max(80).optional(),
    observacoes: z.string().optional(),
  }),
});

export const listClientsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    q: z.string().optional(),
    ativo: z.coerce.boolean().default(true),
  }),
});

export type CreateClientDTO = z.infer<typeof createClientSchema>["body"];
export type UpdateClientDTO = z.infer<typeof updateClientSchema>["body"];
