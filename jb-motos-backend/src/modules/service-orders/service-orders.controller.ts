import { Request, Response, NextFunction } from "express";
import { serviceOrdersService } from "./service-orders.service.js";
import { ok, created, paginated } from "../../shared/utils/response.js";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await serviceOrdersService.list(req.query as any);
    paginated(res, data, meta);
  } catch (err) { next(err); }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await serviceOrdersService.findById(req.params.id));
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const os = await serviceOrdersService.create(req.body, req.user!.id);
    created(res, os, "Ordem de Serviço aberta com sucesso");
  } catch (err) { next(err); }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const os = await serviceOrdersService.updateStatus(
      req.params.id, req.body, req.user!.id, req.user!.role
    );
    ok(res, os, "Status atualizado com sucesso");
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await serviceOrdersService.update(req.params.id, req.body, req.user!.role), "OS atualizada");
  } catch (err) { next(err); }
};

export const dashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await serviceOrdersService.getDashboard());
  } catch (err) { next(err); }
};
