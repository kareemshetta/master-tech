import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { ProcessorView } from "./processors.view";
import { authenticateAdmin } from "../../../../middlewares/auth.middleware";
const router = Router();
const view = ProcessorView.getInstance();
router.use(asyncWrapper(authenticateAdmin));
router.post("/", asyncWrapper(view.create));
router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
router.put("/:id", asyncWrapper(view.update));
router.delete("/:id", asyncWrapper(view.deleteOne));

export default router;
