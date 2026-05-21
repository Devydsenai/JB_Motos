import { z } from "zod";

export const addCartSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantidade: z.coerce.number().int().min(1).default(1),
    sessionId: z.string().max(64).optional(),
  }),
});

export const updateCartSchema = z.object({
  body: z.object({
    quantidade: z.coerce.number().int().min(1),
  }),
});

export const cartQuerySchema = z.object({
  query: z.object({
    sessionId: z.string().max(64).optional(),
  }),
});

export type AddCartDTO = z.infer<typeof addCartSchema>["body"];
