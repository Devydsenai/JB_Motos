import { Request, Response, NextFunction } from "express";
import { usersService } from "./users.service.js";
import { param } from "../../shared/utils/params.js";
import { ok, created, paginated, noContent } from "../../shared/utils/response.js";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await usersService.list(req.query as any);
    paginated(res, data, meta);
  } catch (err) { next(err); }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await usersService.findById(param(req.params.id)));
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await usersService.create(req.body), "Usuário criado com sucesso");
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await usersService.update(param(req.params.id), req.body), "Usuário atualizado");
  } catch (err) { next(err); }
};

export const deactivate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await usersService.deactivate(param(req.params.id));
    noContent(res);
  } catch (err) { next(err); }
};

export const lookupByCodigo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await usersService.lookupByCodigo(param(req.params.codigo)));
  } catch (err) { next(err); }
};

