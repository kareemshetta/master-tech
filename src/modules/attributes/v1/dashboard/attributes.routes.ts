import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { AttributeView } from "./attributes.view";
const router = Router();
const view = AttributeView.getInstance();

router.post("/", asyncWrapper(view.create));
router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
router.put("/:id", asyncWrapper(view.update));
router.delete("/:id", asyncWrapper(view.deleteOne));

export default router;
