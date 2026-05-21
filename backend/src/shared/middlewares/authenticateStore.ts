import { Request, Response, NextFunction } from "express";
import { verifyStoreToken } from "../utils/jwt.js";
import { prisma } from "../../prisma/client.js";
import { UnauthorizedError } from "../errors/AppError.js";

export const authenticateStore = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token de acesso não fornecido");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyStoreToken(token);

    const customer = await prisma.storeCustomer.findUnique({
      where: { id: payload.customerId },
      select: { id: true, nome: true, email: true, ativo: true },
    });

    if (!customer || !customer.ativo) {
      throw new UnauthorizedError("Cliente não encontrado ou inativo");
    }

    req.storeCustomer = customer;
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
