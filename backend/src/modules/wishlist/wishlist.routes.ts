import { Router } from "express";
import { list, add, remove } from "./wishlist.controller.js";
import { authenticateStore } from "../../shared/middlewares/authenticateStore.js";
import { validate } from "../../shared/middlewares/validate.js";
import { addWishlistSchema } from "./wishlist.schemas.js";

const router = Router();

router.use(authenticateStore);

router.get("/", list);
router.post("/", validate(addWishlistSchema), add);
router.delete("/:productId", remove);

export { router as wishlistRoutes };
