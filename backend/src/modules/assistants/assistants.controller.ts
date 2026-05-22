import { Request, Response, NextFunction } from "express";
import { proxyAdminAssistant, proxyClienteAssistant } from "./assistants.service.js";

export async function postClienteAssistant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await proxyClienteAssistant(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function postAdminAssistant(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await proxyAdminAssistant(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
