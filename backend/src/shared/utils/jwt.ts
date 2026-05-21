import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { Role } from "../../../generated/prisma/client.js";

export type TokenType = "admin" | "store";

export interface AdminJwtPayload {
  type: "admin";
  userId: string;
  role: Role;
}

export interface StoreJwtPayload {
  type: "store";
  customerId: string;
}

export type JwtPayload = AdminJwtPayload | StoreJwtPayload;

export const signAdminToken = (payload: Omit<AdminJwtPayload, "type">): string =>
  jwt.sign({ ...payload, type: "admin" as const }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

export const signStoreToken = (customerId: string): string =>
  jwt.sign({ type: "store" as const, customerId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

/** @deprecated Use signAdminToken */
export const signToken = (payload: { userId: string; role: Role }): string =>
  signAdminToken(payload);

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, env.JWT_SECRET) as JwtPayload;

export const verifyAdminToken = (token: string): AdminJwtPayload => {
  const payload = verifyToken(token);
  if (payload.type !== "admin") {
    throw new Error("Token inválido para área administrativa");
  }
  return payload;
};

export const verifyStoreToken = (token: string): StoreJwtPayload => {
  const payload = verifyToken(token);
  if (payload.type !== "store") {
    throw new Error("Token inválido para área da loja");
  }
  return payload;
};
