import { Router } from "express";
import {
  list,
  findById,
  create,
  storeCreate,
  updateStatus,
  update,
  dashboard,
} from "./service-orders.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { authenticateStore } from "../../shared/middlewares/authenticateStore.js";
import { authorize } from "../../shared/middlewares/authorize.js";
import { validate } from "../../shared/middlewares/validate.js";
import {
  createServiceOrderSchema,
  updateStatusSchema,
  updateServiceOrderSchema,
  listServiceOrdersSchema,
} from "./service-orders.schemas.js";

const router = Router();

const optionalStore = (req: any, res: any, next: any) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return authenticateStore(req, res, next);
  }
  next();
};

router.post("/store", optionalStore, validate(createServiceOrderSchema), storeCreate);

router.use(authenticate);

router.get("/dashboard", authorize("PROPRIETARIO"), dashboard);
router.get(
  "/",
  authorize("PROPRIETARIO", "ATENDENTE", "MECANICO"),
  validate(listServiceOrdersSchema),
  list,
);
router.get("/:id", authorize("PROPRIETARIO", "ATENDENTE", "MECANICO"), findById);
router.post("/", authorize("PROPRIETARIO", "ATENDENTE"), validate(createServiceOrderSchema), create);
router.patch(
  "/:id/status",
  authorize("PROPRIETARIO", "ATENDENTE", "MECANICO"),
  validate(updateStatusSchema),
  updateStatus,
);
router.put(
  "/:id",
  authorize("PROPRIETARIO", "ATENDENTE", "MECANICO"),
  validate(updateServiceOrderSchema),
  update,
);

export { router as serviceOrdersRoutes };
