import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { BrandView } from "./brands.view";
import { authenticateAdmin } from "../../../../middlewares/auth.middleware";
import { authorizeSuperAdmin } from "../../../../middlewares/authorize.midddleware";
const router = Router();
const view = BrandView.getInstance();
router.use(asyncWrapper(authenticateAdmin));
router.post(
  "/",
  asyncWrapper(authorizeSuperAdmin),
  asyncWrapper(view.createBrand)
);
router.get("/", asyncWrapper(authorizeSuperAdmin), asyncWrapper(view.getAll));
router.get(
  "/:id",

  asyncWrapper(view.getOneById)
);
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
