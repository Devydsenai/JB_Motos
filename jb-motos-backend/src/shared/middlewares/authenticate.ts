import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../../prisma/client.js";
import { UnauthorizedError } from "../errors/AppError.js";

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token de acesso não fornecido");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, nome: true, email: true, role: true, ativo: true },
    });

    if (!user || !user.ativo) {
      throw new UnauthorizedError("Usuário não encontrado ou inativo");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof Error && err.name === "JsonWebTokenError") {
      return next(new UnauthorizedError("Token inválido"));
    }
    if (err instanceof Error && err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Token expirado. Faça login novamente."));
    }
    next(err);
  }
};
