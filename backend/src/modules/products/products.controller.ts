import { Request, Response, NextFunction } from "express";
import { productsService } from "./products.service.js";
import { param } from "../../shared/utils/params.js";
import { ok, created, paginated, noContent } from "../../shared/utils/response.js";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await productsService.list(req.query as any);
    paginated(res, data, meta);
  } catch (err) { next(err); }
};

export const listStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await productsService.listStore(req.query as any));
  } catch (err) { next(err); }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await productsService.findById(param(req.params.id)));
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await productsService.create(req.body), "Produto criado");
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await productsService.update(param(req.params.id), req.body), "Produto atualizado");
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productsService.remove(param(req.params.id));
    noContent(res);
  } catch (err) { next(err); }
};

