import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { AboutusView } from "../dashboard/aboutus.view";

const router = Router();
const view = AboutusView.getInstance();

router.get("/", asyncWrapper(view.getOneById));

export default router;
