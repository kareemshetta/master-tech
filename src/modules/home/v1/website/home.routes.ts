import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { HomeView } from "../dashboard/home.view";

const router = Router();
const view = HomeView.getInstance();

router.get("/", asyncWrapper(view.getOneById));

export default router;
