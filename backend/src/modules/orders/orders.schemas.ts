import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    observacao: z.string().optional(),
    frete: z.coerce.number().min(0).default(0),
    desconto: z.coerce.number().min(0).default(0),
    sessionId: z.string().optional(),
    entregaNome: z.string().optional(),
    entregaEmail: z.string().email().optional(),
    entregaTelefone: z.string().optional(),
    entregaEndereco: z.string().optional(),
    entregaCidade: z.string().optional(),
    entregaEstado: z.string().max(2).optional(),
    entregaCep: z.string().optional(),
    entregaPais: z.string().optional(),
  }),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>["body"];
