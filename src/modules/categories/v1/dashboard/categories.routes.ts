import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { CategoryView } from "./categories.view";
const router = Router();
const view = CategoryView.getInstance();

router.post("/", asyncWrapper(view.createCat));
router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
router.put("/:id", asyncWrapper(view.update));
router.delete("/:id", asyncWrapper(view.deleteOne));

export default router;
