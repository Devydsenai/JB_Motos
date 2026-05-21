import { Request, Response, NextFunction } from "express";
import { paymentsService } from "./payments.service.js";
import { param } from "../../shared/utils/params.js";
import { ok, created } from "../../shared/utils/response.js";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await paymentsService.create(req.body), "Pagamento iniciado");
  } catch (err) { next(err); }
};

/** Checkout Pro — retorna { link } para redirecionar ao Mercado Pago */
export const createPreference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(
      res,
      await paymentsService.createCheckoutPreference(req.body),
      "Preferência de pagamento criada",
    );
  } catch (err) { next(err); }
};

export const byOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await paymentsService.findByOrder(param(req.params.orderId)));
  } catch (err) { next(err); }
};

export const webhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await paymentsService.webhook(req.body), "Webhook processado");
  } catch (err) { next(err); }
};

export const confirmMock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(
      res,
      await paymentsService.confirmMock(param(req.params.ref), req.body.status ?? "APROVADO"),
      "Pagamento atualizado",
    );
  } catch (err) { next(err); }
};

