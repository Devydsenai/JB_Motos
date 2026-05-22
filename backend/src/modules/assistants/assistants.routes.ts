import { Router } from "express";
import { postAdminAssistant, postClienteAssistant } from "./assistants.controller.js";

const router = Router();

router.post("/client", postClienteAssistant);
router.post("/admin", postAdminAssistant);

export { router as assistantsRoutes };
