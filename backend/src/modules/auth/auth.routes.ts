import { Router } from "express";
import { login, me, changePassword } from "./auth.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { validate } from "../../shared/middlewares/validate.js";
import { loginSchema, changePasswordSchema } from "./auth.schemas.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, me);
router.patch("/change-password", authenticate, validate(changePasswordSchema), changePassword);

export { router as authRoutes };
