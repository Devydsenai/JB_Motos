import { Router } from "express";
import { create, myOrders, findById, listAdmin } from "./orders.controller.js";
import { authenticateStore } from "../../shared/middlewares/authenticateStore.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { authorize } from "../../shared/middlewares/authorize.js";
import { validate } from "../../shared/middlewares/validate.js";
import { createOrderSchema } from "./orders.schemas.js";

const router = Router();

const optionalStore = (req: any, res: any, next: any) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return authenticateStore(req, res, next);
  }
  next();
};

router.post("/", optionalStore, validate(createOrderSchema), create);

router.get("/my", authenticateStore, myOrders);
router.get("/:id", optionalStore, findById);

router.get("/", authenticate, authorize("PROPRIETARIO", "ATENDENTE"), listAdmin);

export { router as ordersRoutes };
