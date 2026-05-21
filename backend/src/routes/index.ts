import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { usersRoutes } from "../modules/users/users.routes.js";
import { clientsRoutes } from "../modules/clients/clients.routes.js";
import { motorcyclesRoutes } from "../modules/motorcycles/motorcycles.routes.js";
import { serviceOrdersRoutes } from "../modules/service-orders/service-orders.routes.js";
import { partsRoutes } from "../modules/parts/parts.routes.js";
import { productsRoutes } from "../modules/products/products.routes.js";
import { suppliersRoutes } from "../modules/suppliers/suppliers.routes.js";
import { stockRoutes } from "../modules/stock/stock.routes.js";
import { storeCustomersRoutes } from "../modules/store-customers/store-customers.routes.js";
import { cartRoutes } from "../modules/cart/cart.routes.js";
import { wishlistRoutes } from "../modules/wishlist/wishlist.routes.js";
import { ordersRoutes } from "../modules/orders/orders.routes.js";
import { paymentsRoutes } from "../modules/payments/payments.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/clients", clientsRoutes);
router.use("/motorcycles", motorcyclesRoutes);
router.use("/service-orders", serviceOrdersRoutes);
router.use("/parts", partsRoutes);
router.use("/products", productsRoutes);
router.use("/suppliers", suppliersRoutes);
router.use("/stock", stockRoutes);
router.use("/store/customers", storeCustomersRoutes);
router.use("/store/cart", cartRoutes);
router.use("/store/wishlist", wishlistRoutes);
router.use("/store/orders", ordersRoutes);
router.use("/store/payments", paymentsRoutes);

export { router as apiRoutes };
