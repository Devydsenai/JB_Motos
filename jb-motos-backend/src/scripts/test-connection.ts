import "dotenv/config";
import { prisma } from "../prisma/client.js";

async function main() {
  console.log("🔌 Testando conexão com Supabase...");
  try {
    await prisma.$queryRaw`SELECT version()`;
    console.log("✅ Conexão OK!");

    const userCount = await prisma.user.count();
    const clientCount = await prisma.client.count();
    const osCount = await prisma.serviceOrder.count();

    console.log("\n📊 Contagem de registros:");
    console.log(`  users: ${userCount}`);
    console.log(`  clients: ${clientCount}`);
    console.log(`  service_orders: ${osCount}`);
  } catch (err) {
    console.error("❌ Falha na conexão:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
