import { prisma } from "../../prisma/client.js";
import { hashPassword, comparePassword } from "../../shared/utils/hash.js";
import { signStoreToken } from "../../shared/utils/jwt.js";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../shared/errors/AppError.js";
import { RegisterDTO, StoreLoginDTO, MotorcycleDTO } from "./store-customers.schemas.js";

export class StoreCustomersService {
  async register(dto: RegisterDTO) {
    const email = dto.email.toLowerCase().trim();
    const exists = await prisma.storeCustomer.findUnique({ where: { email } });
    if (exists) throw new ConflictError("E-mail já cadastrado");

    const senhaHash = await hashPassword(dto.senha);
    const customer = await prisma.storeCustomer.create({
      data: {
        nome: dto.nome.trim(),
        email,
        senhaHash,
        telefone: dto.telefone,
        cpf: dto.cpf,
      },
      select: { id: true, nome: true, email: true, telefone: true, createdAt: true },
    });

    const token = signStoreToken(customer.id);
    return { token, customer };
  }

  async login(dto: StoreLoginDTO) {
    const email = dto.email.toLowerCase().trim();
    const customer = await prisma.storeCustomer.findUnique({
      where: { email },
      select: { id: true, nome: true, email: true, senhaHash: true, ativo: true, telefone: true },
    });

    if (!customer || !customer.ativo) {
      throw new UnauthorizedError("Credenciais inválidas");
    }

    const ok = await comparePassword(dto.senha, customer.senhaHash);
    if (!ok) throw new UnauthorizedError("Credenciais inválidas");

    const token = signStoreToken(customer.id);
    const { senhaHash: _, ...safe } = customer;
    return { token, customer: safe };
  }

  async me(customerId: string) {
    const customer = await prisma.storeCustomer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cpf: true,
        createdAt: true,
        motorcycles: {
          orderBy: [{ principal: "desc" }, { createdAt: "desc" }],
        },
      },
    });
    if (!customer) throw new NotFoundError("Cliente");
    return customer;
  }

  async addMotorcycle(customerId: string, dto: MotorcycleDTO) {
    if (dto.principal) {
      await prisma.storeMotorcycle.updateMany({
        where: { storeCustomerId: customerId },
        data: { principal: false },
      });
    }

    return prisma.storeMotorcycle.create({
      data: {
        storeCustomerId: customerId,
        marca: dto.marca,
        modelo: dto.modelo,
        placa: dto.placa,
        identificador: dto.identificador,
        imagemUrl: dto.imagemUrl,
        principal: dto.principal ?? true,
      },
    });
  }

  async listMotorcycles(customerId: string) {
    return prisma.storeMotorcycle.findMany({
      where: { storeCustomerId: customerId },
      orderBy: [{ principal: "desc" }, { createdAt: "desc" }],
    });
  }
}

export const storeCustomersService = new StoreCustomersService();
