import { Router } from "express";
import {
  list,
  findById,
  create,
  update,
  deactivate,
  lookupByCodigo,
} from "./users.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { authorize } from "../../shared/middlewares/authorize.js";
import { validate } from "../../shared/middlewares/validate.js";
import {
  createUserSchema,
  updateUserSchema,
  listUsersSchema,
  lookupCodigoSchema,
} from "./users.schemas.js";

const router = Router();

router.use(authenticate);

router.get(
  "/lookup/:codigo",
  authorize("PROPRIETARIO", "ATENDENTE", "MECANICO"),
  validate(lookupCodigoSchema),
  lookupByCodigo,
);

router.use(authorize("PROPRIETARIO"));

router.get("/", validate(listUsersSchema), list);
router.get("/:id", findById);
router.post("/", validate(createUserSchema), create);
router.put("/:id", validate(updateUserSchema), update);
router.delete("/:id", deactivate);

export { router as usersRoutes };
