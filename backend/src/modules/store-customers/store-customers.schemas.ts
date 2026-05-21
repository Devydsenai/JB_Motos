import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    nome: z.string().min(2).max(120),
    email: z.string().email(),
    senha: z.string().min(6),
    telefone: z.string().optional(),
    cpf: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    senha: z.string().min(1),
  }),
});

export const motorcycleSchema = z.object({
  body: z.object({
    marca: z.string().min(1).max(60),
    modelo: z.string().min(1).max(80),
    placa: z.string().max(10).optional(),
    identificador: z.string().max(60).optional(),
    imagemUrl: z.string().optional(),
    principal: z.boolean().optional(),
  }),
});

export type RegisterDTO = z.infer<typeof registerSchema>["body"];
export type StoreLoginDTO = z.infer<typeof loginSchema>["body"];
export type MotorcycleDTO = z.infer<typeof motorcycleSchema>["body"];
