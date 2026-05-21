import { Response } from "express";

export const ok = <T>(res: Response, data: T, message = "Operação realizada com sucesso") =>
  res.status(200).json({ success: true, message, data });

export const created = <T>(res: Response, data: T, message = "Criado com sucesso") =>
  res.status(201).json({ success: true, message, data });

export const noContent = (res: Response) => res.status(204).send();

export const paginated = <T>(
  res: Response,
  data: T,
  meta: { total: number; page: number; limit: number }
) =>
  res.status(200).json({
    success: true,
    data,
    meta: { ...meta, pages: Math.ceil(meta.total / meta.limit) },
  });
