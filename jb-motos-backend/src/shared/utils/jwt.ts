import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { Role } from "../../../generated/prisma/client.js";

export interface JwtPayload {
  userId: string;
  role: Role;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
};
