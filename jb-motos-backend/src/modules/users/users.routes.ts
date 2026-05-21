import { Router } from "express";
import { list, findById, create, update, deactivate } from "./users.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { authorize } from "../../shared/middlewares/authorize.js";
import { validate } from "../../shared/middlewares/validate.js";
import { createUserSchema, updateUserSchema, listUsersSchema } from "./users.schemas.js";

const router = Router();

router.use(authenticate, authorize("PROPRIETARIO"));

router.get("/", validate(listUsersSchema), list);
router.get("/:id", findById);
router.post("/", validate(createUserSchema), create);
router.put("/:id", validate(updateUserSchema), update);
router.delete("/:id", deactivate);

export { router as usersRoutes };
