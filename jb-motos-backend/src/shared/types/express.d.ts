import { Role } from "../../../generated/prisma/client.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        nome: string;
        email: string;
        role: Role;
        ativo: boolean;
      };
    }
  }
}
