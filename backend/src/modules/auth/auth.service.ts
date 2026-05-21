import { prisma } from "../../prisma/client.js";
import { comparePassword, hashPassword } from "../../shared/utils/hash.js";
import { signAdminToken } from "../../shared/utils/jwt.js";
import { UnauthorizedError, AppError } from "../../shared/errors/AppError.js";
import { LoginDTO, ChangePasswordDTO } from "./auth.schemas.js";

export class AuthService {
  async login({ email, senha }: LoginDTO) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, nome: true, email: true, senhaHash: true, role: true, ativo: true },
    });

    if (!user || !user.ativo) {
      throw new UnauthorizedError("Credenciais inválidas");
    }

    const senhaOk = await comparePassword(senha, user.senhaHash);
    if (!senhaOk) {
      throw new UnauthorizedError("Credenciais inválidas");
    }

    const token = signAdminToken({ userId: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    };
  }

  async me(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nome: true, email: true, role: true, telefone: true, createdAt: true },
    });
  }

  async changePassword(userId: string, { senhaAtual, novaSenha }: ChangePasswordDTO) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { senhaHash: true },
    });

    if (!user) throw new AppError("Usuário não encontrado", 404);

    const ok = await comparePassword(senhaAtual, user.senhaHash);
    if (!ok) throw new UnauthorizedError("Senha atual incorreta");

    const senhaHash = await hashPassword(novaSenha);
    await prisma.user.update({ where: { id: userId }, data: { senhaHash } });
  }
}

export const authService = new AuthService();
