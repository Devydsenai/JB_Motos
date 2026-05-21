import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().uuid(),
    metodo: z.enum(["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO", "BOLETO"]),
    valor: z.coerce.number().positive().optional(),
  }),
});

export const webhookSchema = z.object({
  body: z.object({
    referenciaExterna: z.string(),
    status: z.enum(["APROVADO", "RECUSADO", "CANCELADO", "REEMBOLSADO"]),
    mercadoPagoId: z.string().optional(),
  }),
});

export const createPreferenceSchema = z.object({
  body: z.object({
    orderId: z.string().uuid().optional(),
    externalReference: z.string().optional(),
    items: z
      .array(
        z.object({
          id: z.string().optional(),
          title: z.string().min(1),
          quantity: z.coerce.number().int().positive(),
          unit_price: z.coerce.number().positive(),
        }),
      )
      .min(1)
      .optional(),
    payer: z
      .object({
        name: z.string().optional(),
        surname: z.string().optional(),
        email: z.string().email().optional(),
      })
      .optional(),
  }),
});

export type CreatePaymentDTO = z.infer<typeof createPaymentSchema>["body"];
export type CreatePreferenceDTO = z.infer<typeof createPreferenceSchema>["body"];
