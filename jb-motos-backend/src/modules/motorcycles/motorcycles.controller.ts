import { Request, Response, NextFunction } from "express";
import { motorcyclesService } from "./motorcycles.service.js";
import { ok, created, paginated, noContent } from "../../shared/utils/response.js";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await motorcyclesService.list(req.query as any);
    paginated(res, data, meta);
  } catch (err) { next(err); }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await motorcyclesService.findById(req.params.id));
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await motorcyclesService.create(req.body), "Motocicleta cadastrada com sucesso");
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await motorcyclesService.update(req.params.id, req.body), "Motocicleta atualizada");
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await motorcyclesService.softDelete(req.params.id);
    noContent(res);
  } catch (err) { next(err); }
};
