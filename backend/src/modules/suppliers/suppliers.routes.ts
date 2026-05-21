import { Router } from "express";
import { list, findById, create, update, remove } from "./suppliers.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { authorize } from "../../shared/middlewares/authorize.js";
import { validate } from "../../shared/middlewares/validate.js";
import {
  createSupplierSchema,
  updateSupplierSchema,
  listSuppliersSchema,
} from "./suppliers.schemas.js";

const router = Router();

router.use(authenticate, authorize("PROPRIETARIO", "ATENDENTE"));

router.get("/", validate(listSuppliersSchema), list);
router.get("/:id", findById);
router.post("/", validate(createSupplierSchema), create);
router.put("/:id", validate(updateSupplierSchema), update);
router.delete("/:id", remove);

export { router as suppliersRoutes };
