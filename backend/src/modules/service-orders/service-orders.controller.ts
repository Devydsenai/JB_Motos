import { Request, Response, NextFunction } from "express";
import { serviceOrdersService } from "./service-orders.service.js";
import { param } from "../../shared/utils/params.js";
import { ok, created, paginated } from "../../shared/utils/response.js";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await serviceOrdersService.list(req.query as any);
    paginated(res, data, meta);
  } catch (err) { next(err); }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await serviceOrdersService.findById(param(req.params.id)));
  } catch (err) { next(err); }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const os = await serviceOrdersService.create(
      { ...req.body, origem: req.body.origem ?? "OFICINA" },
      req.user!.id,
    );
    created(res, os, "Ordem de Serviço aberta com sucesso");
  } catch (err) { next(err); }
};

export const storeCreate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const os = await serviceOrdersService.create({
      ...req.body,
      origem: "LOJA_ONLINE",
      storeCustomerId: req.storeCustomer?.id ?? req.body.storeCustomerId,
    });
    created(res, os, "Solicitação de serviço enviada");
  } catch (err) { next(err); }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const os = await serviceOrdersService.updateStatus(
      param(req.params.id), req.body, req.user!.id, req.user!.role
    );
    ok(res, os, "Status atualizado com sucesso");
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await serviceOrdersService.update(param(req.params.id), req.body, req.user!.role), "OS atualizada");
  } catch (err) { next(err); }
};

export const dashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await serviceOrdersService.getDashboard());
  } catch (err) { next(err); }
};

