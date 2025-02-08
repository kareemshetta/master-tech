import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { CityView } from "./cities.view";
import { authenticateAdmin } from "../../../../middlewares/auth.middleware";
import { authorizeSuperAdmin } from "../../../../middlewares/authorize.midddleware";
const router = Router();
const view = CityView.getInstance();
router.use(asyncWrapper(authenticateAdmin));
router.post("/", asyncWrapper(authorizeSuperAdmin), asyncWrapper(view.create));
router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
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
