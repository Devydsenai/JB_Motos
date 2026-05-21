import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { usersRoutes } from "../modules/users/users.routes.js";
import { clientsRoutes } from "../modules/clients/clients.routes.js";
import { motorcyclesRoutes } from "../modules/motorcycles/motorcycles.routes.js";
import { serviceOrdersRoutes } from "../modules/service-orders/service-orders.routes.js";
import { partsRoutes } from "../modules/parts/parts.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/clients", clientsRoutes);
router.use("/motorcycles", motorcyclesRoutes);
router.use("/service-orders", serviceOrdersRoutes);
router.use("/parts", partsRoutes);

export { router as apiRoutes };
