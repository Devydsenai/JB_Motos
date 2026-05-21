import { z } from "zod";

export const movementSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    tipo: z.enum(["ENTRADA", "SAIDA", "AJUSTE"]),
    quantidade: z.coerce.number().positive(),
    observacao: z.string().optional(),
  }),
});

export const listMovementsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    productId: z.string().uuid().optional(),
  }),
});

export type MovementDTO = z.infer<typeof movementSchema>["body"];
