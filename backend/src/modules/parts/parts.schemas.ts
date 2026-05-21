import { z } from "zod";

export const createPartSchema = z.object({
  body: z.object({
    serviceOrderId: z.string().uuid("serviceOrderId deve ser UUID válido"),
    descricao: z.string().min(2, "Descrição é obrigatória").max(200),
    quantidade: z.number().positive("Quantidade deve ser positiva").default(1),
    valorUnitario: z.number().positive("Valor unitário deve ser positivo"),
  }),
});

export const updatePartSchema = z.object({
  body: z.object({
    descricao: z.string().min(2).max(200).optional(),
    quantidade: z.number().positive().optional(),
    valorUnitario: z.number().positive().optional(),
  }),
});

export type CreatePartDTO = z.infer<typeof createPartSchema>["body"];
export type UpdatePartDTO = z.infer<typeof updatePartSchema>["body"];
