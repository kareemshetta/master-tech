import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { CartView } from "./carts.view";
import { authenticateUser } from "../../../../middlewares/auth.middleware";
const router = Router();
const view = CartView.getInstance();
router.use(asyncWrapper(authenticateUser));
router.post("/", asyncWrapper(view.createCartItem));
router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
router.put("/:id", asyncWrapper(view.update));
router.delete("/:id", asyncWrapper(view.deleteOne));

export default router;
