import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { ProcessorView } from "./processors.view";

const router = Router();
const view = ProcessorView.getInstance();

router.get("/", asyncWrapper(view.getAll));

export default router;
