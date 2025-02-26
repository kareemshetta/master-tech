import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { BrandView } from "../dashboard/brands.view";

const router = Router();
const view = BrandView.getInstance();

router.get("/", asyncWrapper(view.getAll));

export default router;
