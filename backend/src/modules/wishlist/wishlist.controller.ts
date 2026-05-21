import { Request, Response, NextFunction } from "express";
import { wishlistService } from "./wishlist.service.js";
import { param } from "../../shared/utils/params.js";
import { ok, created, noContent } from "../../shared/utils/response.js";

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await wishlistService.list(req.storeCustomer!.id));
  } catch (err) { next(err); }
};

export const add = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(
      res,
      await wishlistService.add(req.storeCustomer!.id, req.body.productId),
      "Adicionado aos favoritos",
    );
  } catch (err) { next(err); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await wishlistService.remove(req.storeCustomer!.id, param(req.params.productId));
    noContent(res);
  } catch (err) { next(err); }
};

