import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { AboutusView } from "./aboutus.view";
import { authenticateAdmin } from "../../../../middlewares/auth.middleware";
import { authorizeSuperAdmin } from "../../../../middlewares/authorize.midddleware";
const router = Router();
const view = AboutusView.getInstance();
router.use(asyncWrapper(authenticateAdmin));
router.post("/", asyncWrapper(authorizeSuperAdmin), asyncWrapper(view.create));
router.get("/", asyncWrapper(view.getOneForDashboard));

router.put(
  "/:id",
  asyncWrapper(authorizeSuperAdmin),
  asyncWrapper(view.update)
);
router.delete(
  "/:id",
  asyncWrapper(authorizeSuperAdmin),
  asyncWrapper(view.deleteOne)
);

export default router;
