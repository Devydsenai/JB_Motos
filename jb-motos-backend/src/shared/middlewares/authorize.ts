import { Request, Response, NextFunction } from "express";
import { Role } from "../../../generated/prisma/client.js";
import { ForbiddenError, UnauthorizedError } from "../errors/AppError.js";

export const authorize = (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }
    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError("Você não tem permissão para esta ação"));
    }
    next();
  };
