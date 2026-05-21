import { Router } from "express";
import {
  create,
  createPreference,
  byOrder,
  webhook,
  confirmMock,
} from "./payments.controller.js";
import { validate } from "../../shared/middlewares/validate.js";
import {
  createPaymentSchema,
  createPreferenceSchema,
  webhookSchema,
} from "./payments.schemas.js";

const router = Router();

router.post("/preference", validate(createPreferenceSchema), createPreference);
router.post("/", validate(createPaymentSchema), create);
router.get("/order/:orderId", byOrder);
router.post("/webhook", validate(webhookSchema), webhook);
router.post("/mock/:ref/confirm", confirmMock);

export { router as paymentsRoutes };
