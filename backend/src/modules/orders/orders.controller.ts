import { Request, Response, NextFunction } from "express";
import { ordersService } from "./orders.service.js";
import { param } from "../../shared/utils/params.js";
import { ok, created, paginated } from "../../shared/utils/response.js";

function owner(req: Request) {
  return {
    customerId: req.storeCustomer?.id,
    sessionId: (req.body.sessionId ?? req.query.sessionId) as string | undefined,
  };
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await ordersService.createFromCart(req.body, owner(req)), "Pedido criado");
  } catch (err) { next(err); }
};

export const myOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await ordersService.listByCustomer(req.storeCustomer!.id));
  } catch (err) { next(err); }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await ordersService.findById(param(req.params.id), req.storeCustomer?.id));
  } catch (err) { next(err); }
};

export const listAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await ordersService.listAdmin(req.query as any);
    paginated(res, data, meta);
  } catch (err) { next(err); }
};

