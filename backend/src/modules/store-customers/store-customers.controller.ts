import { Request, Response, NextFunction } from "express";
import { storeCustomersService } from "./store-customers.service.js";
import { ok, created } from "../../shared/utils/response.js";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(res, await storeCustomersService.register(req.body), "Cadastro realizado");
  } catch (err) { next(err); }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await storeCustomersService.login(req.body));
  } catch (err) { next(err); }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await storeCustomersService.me(req.storeCustomer!.id));
  } catch (err) { next(err); }
};

export const addMotorcycle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    created(
      res,
      await storeCustomersService.addMotorcycle(req.storeCustomer!.id, req.body),
      "Moto cadastrada",
    );
  } catch (err) { next(err); }
};

export const listMotorcycles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    ok(res, await storeCustomersService.listMotorcycles(req.storeCustomer!.id));
  } catch (err) { next(err); }
};
