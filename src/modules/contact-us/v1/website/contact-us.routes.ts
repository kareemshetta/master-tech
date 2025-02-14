import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { ContactusView } from "../dashboard/contact-us.view";

const router = Router();
const view = ContactusView.getInstance();

router.post("/", asyncWrapper(view.create));

export default router;
