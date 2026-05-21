import { Router } from "express";
import { list, findById, create, update, remove } from "./motorcycles.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { authorize } from "../../shared/middlewares/authorize.js";
import { validate } from "../../shared/middlewares/validate.js";
import { createMotorcycleSchema, updateMotorcycleSchema, listMotorcyclesSchema } from "./motorcycles.schemas.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("PROPRIETARIO", "ATENDENTE", "MECANICO"), validate(listMotorcyclesSchema), list);
router.get("/:id", authorize("PROPRIETARIO", "ATENDENTE", "MECANICO"), findById);
router.post("/", authorize("PROPRIETARIO", "ATENDENTE"), validate(createMotorcycleSchema), create);
router.put("/:id", authorize("PROPRIETARIO", "ATENDENTE"), validate(updateMotorcycleSchema), update);
router.delete("/:id", authorize("PROPRIETARIO"), remove);

export { router as motorcyclesRoutes };
