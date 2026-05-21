import { Router } from "express";
import { list, add, update, remove, clear } from "./cart.controller.js";
import { authenticateStore } from "../../shared/middlewares/authenticateStore.js";
import { validate } from "../../shared/middlewares/validate.js";
import { addCartSchema, updateCartSchema, cartQuerySchema } from "./cart.schemas.js";

const router = Router();

const optionalStore = (req: any, res: any, next: any) => {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    return authenticateStore(req, res, next);
  }
  next();
};

router.use(optionalStore);

router.get("/", validate(cartQuerySchema), list);
router.post("/", validate(addCartSchema), add);
router.patch("/:id", validate(updateCartSchema), update);
router.delete("/clear", clear);
router.delete("/:id", remove);

export { router as cartRoutes };
