import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { ReviewView } from "./reviews.view";
import { authenticateUser } from "../../../../middlewares/auth.middleware";
import { authorizeSuperAdmin } from "../../../../middlewares/authorize.midddleware";
const router = Router();
const view = ReviewView.getInstance();

router.post("/", asyncWrapper(authenticateUser), asyncWrapper(view.create));
router.get("/all/:productId", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
router.put("/:id", asyncWrapper(authenticateUser), asyncWrapper(view.update));
router.delete(
  "/:id",
  asyncWrapper(authenticateUser),
  asyncWrapper(view.deleteOne)
);

export default router;
