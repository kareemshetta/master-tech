import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { RegionView } from "./regions.view";
const router = Router();
const view = RegionView.getInstance();

// router.post("/", asyncWrapper(view.create));
router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
// router.put("/:id", asyncWrapper(view.update));
// router.delete("/:id", asyncWrapper(view.deleteOne));

export default router;
