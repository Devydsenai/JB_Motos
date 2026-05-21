import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32, "JWT_SECRET precisa ter ao menos 32 caracteres"),
  JWT_EXPIRES_IN: z.string().default("8h"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
