import { Request, Response, NextFunction } from "express";
import { stockService } from "./stock.service.js";
import { ok, created, paginated } from "../../shared/utils/response.js";

export const listMovements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, meta } = await stockService.listMovements(req.query as any);
    paginated(res, data, meta);
  } catch (err) { next(err); }
};

export const lowStock = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await stockService.lowStock());
  } catch (err) { next(err); }
};

export const move = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await stockService.move(req.body, req.user?.id), "Movimentação registrada");
  } catch (err) { next(err); }
};
