import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { BrandView } from "./brands.view";
const router = Router();
const view = BrandView.getInstance();

router.post("/", asyncWrapper(view.createBrand));
router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
router.put("/:id", asyncWrapper(view.update));
router.delete("/:id", asyncWrapper(view.deleteOne));

export default router;
