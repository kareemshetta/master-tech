import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { ProductView } from "./products.view";
import { authenticateAdmin } from "../../../../middlewares/auth.middleware";
const router = Router();
const view = ProductView.getInstance();
router.use(asyncWrapper(authenticateAdmin));
router.post("/", asyncWrapper(view.create));
router.post("/acc", asyncWrapper(view.createAccessory));
router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
router.put("/:id", asyncWrapper(view.update));
router.put("/:id/acc", asyncWrapper(view.updateAccessory));
router.delete("/:id", asyncWrapper(view.deleteOne));

export default router;
