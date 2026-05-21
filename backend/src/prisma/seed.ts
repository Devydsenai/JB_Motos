import "dotenv/config";
import { Decimal } from "../shared/utils/decimal.js";
import { prisma } from "../prisma/client.js";
import { hashPassword } from "../shared/utils/hash.js";

async function main() {
  console.log("🌱 Iniciando seed JB Motos...");

  const users = [
    {
      nome: "João",
      sobrenome: "Proprietário",
      email: "proprietario@jbmotos.com",
      senha: "JBMotos@2024",
      role: "PROPRIETARIO" as const,
      telefone: "(81) 99999-0001",
      codigoServico: undefined,
    },
    {
      nome: "Ana",
      sobrenome: "Atendente",
      email: "atendente@jbmotos.com",
      senha: "JBMotos@2024",
      role: "ATENDENTE" as const,
      telefone: "(81) 99999-0002",
      codigoServico: "1001",
    },
    {
      nome: "Carlos",
      sobrenome: "Mecânico",
      email: "mecanico@jbmotos.com",
      senha: "JBMotos@2024",
      role: "MECANICO" as const,
      telefone: "(81) 99999-0003",
      codigoServico: "1002",
    },
  ];

  for (const u of users) {
    const senhaHash = await hashPassword(u.senha);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        codigoServico: u.codigoServico,
        sobrenome: u.sobrenome,
        ativo: true,
      },
      create: {
        nome: u.nome,
        sobrenome: u.sobrenome,
        email: u.email,
        senhaHash,
        role: u.role,
        telefone: u.telefone,
        codigoServico: u.codigoServico,
        statusRh: "ATIVO",
      },
    });
    console.log(`  ✓ [${u.role}] ${u.email} — senha: ${u.senha}${u.codigoServico ? ` — código: ${u.codigoServico}` : ""}`);
  }

  const supplier = await prisma.supplier.upsert({
    where: { codigo: "FORN-001" },
    update: {},
    create: {
      codigo: "FORN-001",
      nome: "Distribuidora Moto Peças NE",
      cnpj: "12.345.678/0001-90",
      categoria: "Peças",
      status: "ATIVO",
      telefone: "(81) 3333-4444",
      cidade: "Recife",
      estado: "PE",
    },
  });

  const products = [
    {
      codigo: "PEC-COR-001",
      nome: "Corrente de transmissão",
      categoria: "Serviço",
      marcasCompativel: ["Honda", "Yamaha"],
      valor: 89.9,
      quantidade: 15,
      quantidadeMinima: 3,
      visivelLoja: true,
    },
    {
      codigo: "PEC-CHI-002",
      nome: "Chicote e cabo de freio",
      categoria: "Serviço",
      marcasCompativel: ["Honda"],
      valor: 45.0,
      quantidade: 8,
      quantidadeMinima: 2,
      visivelLoja: true,
    },
    {
      codigo: "ACC-CAP-001",
      nome: "Capacete Rogue",
      categoria: "Acessórios",
      marcasCompativel: [],
      valor: 299.9,
      quantidade: 5,
      quantidadeMinima: 1,
      visivelLoja: true,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { codigo: p.codigo },
      update: { visivelLoja: p.visivelLoja },
      create: {
        ...p,
        valor: new Decimal(p.valor),
        precoCusto: new Decimal(p.valor * 0.6),
        quantidade: new Decimal(p.quantidade),
        quantidadeMinima: new Decimal(p.quantidadeMinima),
        fornecedorId: supplier.id,
      },
    });
    console.log(`  ✓ Produto: ${p.nome}`);
  }

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

  await prisma.motorcycle.upsert({
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

  const storeSenha = await hashPassword("Cliente@2024");
  await prisma.storeCustomer.upsert({
    where: { email: "cliente@jbmotos.com" },
    update: {},
    create: {
      nome: "Maria Cliente",
      email: "cliente@jbmotos.com",
      senhaHash: storeSenha,
      telefone: "(81) 98765-4321",
    },
  });

  console.log(`  ✓ Cliente oficina: ${cliente.nome}`);
  console.log(`  ✓ Cliente loja: cliente@jbmotos.com — senha: Cliente@2024`);
  console.log("\n✅ Seed concluído!");
}

main()
  .catch((err) => {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
