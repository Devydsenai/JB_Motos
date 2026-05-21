import { Router } from "express";
import {
  register,
  login,
  me,
  addMotorcycle,
  listMotorcycles,
} from "./store-customers.controller.js";
import { authenticateStore } from "../../shared/middlewares/authenticateStore.js";
import { validate } from "../../shared/middlewares/validate.js";
import {
  registerSchema,
  loginSchema,
  motorcycleSchema,
} from "./store-customers.schemas.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.get("/me", authenticateStore, me);
router.get("/motorcycles", authenticateStore, listMotorcycles);
router.post("/motorcycles", authenticateStore, validate(motorcycleSchema), addMotorcycle);

export { router as storeCustomersRoutes };
