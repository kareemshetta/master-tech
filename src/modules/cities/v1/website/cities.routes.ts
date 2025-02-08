import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { CityView } from "./cities.view";
const router = Router();
const view = CityView.getInstance();

// router.post("/", asyncWrapper(view.create));
router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
// router.put("/:id", asyncWrapper(view.update));
// router.delete("/:id", asyncWrapper(view.deleteOne));

export default router;
