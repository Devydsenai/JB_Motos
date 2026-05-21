import { z } from "zod";

export const createMotorcycleSchema = z.object({
  body: z.object({
    placa: z.string().min(7).max(10).toUpperCase(),
    marca: z.string().min(2).max(60),
    modelo: z.string().min(2).max(80),
    ano: z.number().int().min(1950).max(new Date().getFullYear() + 1),
    cor: z.string().max(40).optional(),
    kmAtual: z.number().int().min(0).optional(),
    observacoes: z.string().optional(),
    clienteId: z.string().uuid("clienteId deve ser um UUID válido"),
  }),
});

export const updateMotorcycleSchema = z.object({
  body: z.object({
    marca: z.string().min(2).max(60).optional(),
    modelo: z.string().min(2).max(80).optional(),
    ano: z.number().int().min(1950).optional(),
    cor: z.string().max(40).optional(),
    kmAtual: z.number().int().min(0).optional(),
    observacoes: z.string().optional(),
  }),
});

export const listMotorcyclesSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    clienteId: z.string().uuid().optional(),
    q: z.string().optional(),
  }),
});

export type CreateMotorcycleDTO = z.infer<typeof createMotorcycleSchema>["body"];
export type UpdateMotorcycleDTO = z.infer<typeof updateMotorcycleSchema>["body"];
