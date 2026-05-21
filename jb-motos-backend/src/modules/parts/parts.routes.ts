import { Router } from "express";
import { listByOS, create, update, remove } from "./parts.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { authorize } from "../../shared/middlewares/authorize.js";
import { validate } from "../../shared/middlewares/validate.js";
import { createPartSchema, updatePartSchema } from "./parts.schemas.js";

const router = Router();

router.use(authenticate);

// GET /parts/by-os/:serviceOrderId
router.get("/by-os/:serviceOrderId", authorize("PROPRIETARIO", "ATENDENTE", "MECANICO"), listByOS);
router.post("/", authorize("PROPRIETARIO", "ATENDENTE", "MECANICO"), validate(createPartSchema), create);
router.put("/:id", authorize("PROPRIETARIO", "ATENDENTE", "MECANICO"), validate(updatePartSchema), update);
router.delete("/:id", authorize("PROPRIETARIO", "ATENDENTE", "MECANICO"), remove);

export { router as partsRoutes };
