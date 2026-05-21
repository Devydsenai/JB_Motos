import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(1, "Senha é obrigatória"),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    senhaAtual: z.string().min(1, "Senha atual é obrigatória"),
    novaSenha: z.string().min(6, "Nova senha precisa ter ao menos 6 caracteres"),
  }),
});

export type LoginDTO = z.infer<typeof loginSchema>["body"];
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>["body"];
