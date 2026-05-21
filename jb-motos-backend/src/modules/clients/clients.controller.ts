import { Request, Response, NextFunction } from "express";
import { clientsService } from "./clients.service.js";
import { ok, created, paginated, noContent } from "../../shared/utils/response.js";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await clientsService.list(req.query as any);
    paginated(res, data, meta);
  } catch (err) { next(err); }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await clientsService.findById(req.params.id));
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await clientsService.create(req.body), "Cliente cadastrado com sucesso");
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await clientsService.update(req.params.id, req.body), "Cliente atualizado");
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await clientsService.softDelete(req.params.id);
    noContent(res);
  } catch (err) { next(err); }
};

export const history = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await clientsService.getHistory(req.params.id));
  } catch (err) { next(err); }
};
