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
  FRONTEND_URL: z.string().url().optional(),
  API_PUBLIC_URL: z.string().url().optional(),
  MERCADO_PAGO_ACCESS_TOKEN: z.string().optional(),
  /** true = usa sandbox_init_point e dados de teste (padrão em development) */
  MERCADO_PAGO_SANDBOX: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  N8N_CLIENT_ASSISTANT_URL: z.string().url().optional(),
  N8N_ADMIN_ASSISTANT_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Variáveis de ambiente inválidas:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
