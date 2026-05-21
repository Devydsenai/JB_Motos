import { Router } from "express";
import {
  list,
  listStore,
  findById,
  create,
  update,
  remove,
} from "./products.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { authorize } from "../../shared/middlewares/authorize.js";
import { validate } from "../../shared/middlewares/validate.js";
import {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
} from "./products.schemas.js";

const router = Router();

router.get("/store", listStore);

router.use(authenticate, authorize("PROPRIETARIO", "ATENDENTE"));

router.get("/", validate(listProductsSchema), list);
router.get("/:id", findById);
router.post("/", validate(createProductSchema), create);
router.put("/:id", validate(updateProductSchema), update);
router.delete("/:id", remove);

export { router as productsRoutes };
