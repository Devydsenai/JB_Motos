import { Router } from "express";
import { listMovements, lowStock, move } from "./stock.controller.js";
import { authenticate } from "../../shared/middlewares/authenticate.js";
import { authorize } from "../../shared/middlewares/authorize.js";
import { validate } from "../../shared/middlewares/validate.js";
import { movementSchema, listMovementsSchema } from "./stock.schemas.js";

const router = Router();

router.use(authenticate, authorize("PROPRIETARIO", "ATENDENTE"));

router.get("/movements", validate(listMovementsSchema), listMovements);
router.get("/low", lowStock);
router.post("/move", validate(movementSchema), move);

export { router as stockRoutes };
