import "dotenv/config";
import { prisma } from "../prisma/client.js";
import { hashPassword } from "../shared/utils/hash.js";

async function main() {
  console.log("🌱 Iniciando seed JB Motos...");

  const users = [
    { nome: "João Proprietário", email: "proprietario@jbmotos.com", senha: "JBMotos@2024", role: "PROPRIETARIO" as const, telefone: "(81) 99999-0001" },
    { nome: "Ana Atendente",     email: "atendente@jbmotos.com",    senha: "JBMotos@2024", role: "ATENDENTE" as const,    telefone: "(81) 99999-0002" },
    { nome: "Carlos Mecânico",   email: "mecanico@jbmotos.com",     senha: "JBMotos@2024", role: "MECANICO" as const,     telefone: "(81) 99999-0003" },
  ];

  for (const u of users) {
    const senhaHash = await hashPassword(u.senha);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, senhaHash, senha: undefined },
    });
    console.log(`  ✓ [${u.role}] ${u.email} — senha: ${u.senha}`);
  }

  // Cliente de exemplo
  const cliente = await prisma.client.upsert({
    where: { telefone: "(81) 99888-7777" },
    update: {},
    create: {
      nome: "Pedro Silva",
      telefone: "(81) 99888-7777",
      email: "pedro@email.com",
      cidade: "Recife",
    },
  });

  // Moto de exemplo
  const moto = await prisma.motorcycle.upsert({
    where: { placa: "PXK-5E67" },
    update: {},
    create: {
      placa: "PXK-5E67",
      marca: "Honda",
      modelo: "CG 160 Titan",
      ano: 2022,
      cor: "Vermelho",
      kmAtual: 15000,
      clienteId: cliente.id,
    },
  });

  console.log(`  ✓ Cliente: ${cliente.nome}`);
  console.log(`  ✓ Moto: ${moto.placa} — ${moto.marca} ${moto.modelo}`);

  console.log("\n✅ Seed concluído!");
}

main()
  .catch((err) => {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
