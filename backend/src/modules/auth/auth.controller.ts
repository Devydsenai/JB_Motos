import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import { ok } from "../../shared/utils/response.js";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.login(req.body);
    ok(res, data, "Login realizado com sucesso");
  } catch (err) { next(err); }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.me(req.user!.id);
    ok(res, data);
  } catch (err) { next(err); }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.changePassword(req.user!.id, req.body);
    ok(res, null, "Senha alterada com sucesso");
  } catch (err) { next(err); }
};
