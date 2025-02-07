import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { OrderView } from "./orders.view";
import { authenticateUser } from "../../../../middlewares/auth.middleware";
const router = Router();
const view = OrderView.getInstance();
router.use(asyncWrapper(authenticateUser));
router.post("/", asyncWrapper(view.create));
router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
router.put("/:id", asyncWrapper(view.update));

export default router;
