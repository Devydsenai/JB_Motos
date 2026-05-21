import { Request, Response, NextFunction } from "express";
import { partsService } from "./parts.service.js";
import { param } from "../../shared/utils/params.js";
import { ok, created, noContent } from "../../shared/utils/response.js";

export const listByOS = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await partsService.listByOS(param(req.params.serviceOrderId)));
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await partsService.create(req.body), "Peça adicionada com sucesso");
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await partsService.update(param(req.params.id), req.body), "Peça atualizada");
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await partsService.remove(param(req.params.id));
    noContent(res);
  } catch (err) { next(err); }
};

