import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { AttributeView } from "../dashboard/attributes.view";

const router = Router();
const view = AttributeView.getInstance();

router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));

export default router;
