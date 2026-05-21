import { Request, Response, NextFunction } from "express";
import { usersService } from "./users.service.js";
import { ok, created, paginated, noContent } from "../../shared/utils/response.js";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await usersService.list(req.query as any);
    paginated(res, data, meta);
  } catch (err) { next(err); }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await usersService.findById(req.params.id));
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await usersService.create(req.body), "Usuário criado com sucesso");
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await usersService.update(req.params.id, req.body), "Usuário atualizado");
  } catch (err) { next(err); }
};

export const deactivate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await usersService.deactivate(req.params.id);
    noContent(res);
  } catch (err) { next(err); }
};
