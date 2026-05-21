import { Router } from "express";
import { list, findById, create, update, remove, history } from "./clients.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { authorize } from "../../shared/middlewares/authorize.js";
import { validate } from "../../shared/middlewares/validate.js";
import { createClientSchema, updateClientSchema, listClientsSchema } from "./clients.schemas.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize("PROPRIETARIO", "ATENDENTE"), validate(listClientsSchema), list);
router.get("/:id", authorize("PROPRIETARIO", "ATENDENTE"), findById);
router.get("/:id/history", authorize("PROPRIETARIO", "ATENDENTE"), history);
router.post("/", authorize("PROPRIETARIO", "ATENDENTE"), validate(createClientSchema), create);
router.put("/:id", authorize("PROPRIETARIO", "ATENDENTE"), validate(updateClientSchema), update);
router.delete("/:id", authorize("PROPRIETARIO"), remove);

export { router as clientsRoutes };
