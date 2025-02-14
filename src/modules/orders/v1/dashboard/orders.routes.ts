import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { OrderView } from "./orders.view";
import { authenticateAdmin } from "../../../../middlewares/auth.middleware";
import { authorizeSuperAdmin } from "../../../../middlewares/authorize.midddleware";
const router = Router();
const view = OrderView.getInstance();
router.use(asyncWrapper(authenticateAdmin));

router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
router.put("/:id", asyncWrapper(view.update));
router.delete("/:id", asyncWrapper(view.deleteOne));

export default router;
