import { Request, Response, NextFunction } from "express";
import { cartService } from "./cart.service.js";
import { param } from "../../shared/utils/params.js";
import { ok, created, noContent } from "../../shared/utils/response.js";

function owner(req: Request) {
  return {
    customerId: req.storeCustomer?.id,
    sessionId: (req.body.sessionId ?? req.query.sessionId) as string | undefined,
  };
}

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await cartService.list(owner(req)));
  } catch (err) { next(err); }
};

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await cartService.add(req.body, owner(req)), "Produto adicionado ao carrinho");
  } catch (err) { next(err); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await cartService.update(param(req.params.id), req.body.quantidade, owner(req)));
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cartService.remove(param(req.params.id), owner(req));
    noContent(res);
  } catch (err) { next(err); }
};

export const clear = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await cartService.clear(owner(req));
    noContent(res);
  } catch (err) { next(err); }
};

