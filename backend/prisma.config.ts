import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations no Supabase exigem DIRECT_URL (porta 5432). Fallback só para `prisma generate` sem .env.
const migrationUrl =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://localhost:5432/postgres";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl,
  },
});
