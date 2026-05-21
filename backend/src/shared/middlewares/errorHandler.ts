import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { env } from "../../config/env.js";

// Mapeia erros do Prisma para mensagens amigáveis
const handlePrismaError = (err: { code?: string; meta?: { target?: string[] } }) => {
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] ?? "campo";
    const messages: Record<string, string> = {
      telefone: "Telefone já cadastrado",
      email: "E-mail já cadastrado",
      placa: "Placa já cadastrada",
      cpf: "CPF já cadastrado",
    };
    return new AppError(messages[field] ?? "Registro duplicado", 409);
  }
  if (err.code === "P2025") {
    return new AppError("Registro não encontrado", 404);
  }
  if (err.code === "P2003") {
    return new AppError("Registro relacionado não encontrado", 400);
  }
  return null;
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Erros do Prisma
  const prismaErr = handlePrismaError(err as { code?: string; meta?: { target?: string[] } });
  if (prismaErr) {
    return res.status(prismaErr.statusCode).json({
      success: false,
      message: prismaErr.message,
    });
  }

  // Erros operacionais conhecidos
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors ? { errors: err.errors as object } : {}),
    });
  }

  // Erros inesperados
  if (env.NODE_ENV === "development") {
    console.error("UNHANDLED ERROR:", err);
  }

  return res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
