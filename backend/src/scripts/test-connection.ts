import "dotenv/config";
import { prisma } from "../lib/prisma.js";

async function main() {
  const registros = await prisma.teste.findMany({ take: 5 });
  console.log("Conexão OK. Registros na tabela teste:", registros.length);
  console.log(registros);
}

main()
  .catch((error) => {
    console.error("Falha ao conectar ou consultar:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
