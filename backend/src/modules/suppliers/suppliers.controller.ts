import { Request, Response, NextFunction } from "express";
import { suppliersService } from "./suppliers.service.js";
import { param } from "../../shared/utils/params.js";
import { ok, created, paginated, noContent } from "../../shared/utils/response.js";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await suppliersService.list(req.query as any);
    paginated(res, data, meta);
  } catch (err) { next(err); }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await suppliersService.findById(param(req.params.id)));
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await suppliersService.create(req.body), "Fornecedor criado");
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await suppliersService.update(param(req.params.id), req.body), "Fornecedor atualizado");
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await suppliersService.remove(param(req.params.id));
    noContent(res);
  } catch (err) { next(err); }
};

