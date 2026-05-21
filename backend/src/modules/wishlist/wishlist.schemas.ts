import { z } from "zod";

export const addWishlistSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
  }),
});
