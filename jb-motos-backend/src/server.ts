import "dotenv/config";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./prisma/client.js";

const startServer = async () => {
  try {
    // Verifica conexão com banco antes de subir
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Banco de dados conectado");

    app.listen(env.PORT, () => {
      console.log(`
╔══════════════════════════════════════╗
║         JB Motos API v1.0.0          ║
╠══════════════════════════════════════╣
║  Porta:  ${env.PORT}                         ║
║  Env:    ${env.NODE_ENV.padEnd(12)}              ║
║  URL:    http://localhost:${env.PORT}/api/v1  ║
╚══════════════════════════════════════╝
      `);
    });
  } catch (err) {
    console.error("❌ Falha ao iniciar servidor:", err);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n📛 ${signal} recebido. Encerrando servidor...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer();
