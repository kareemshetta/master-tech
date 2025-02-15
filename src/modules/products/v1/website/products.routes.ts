import { Router } from "express";

import asyncWrapper from "../../../../utils/async-wrapper";
import { ProductView } from "./products.view";
import {
  authenticateUser,
  optionalAuthenticateUser,
} from "../../../../middlewares/auth.middleware";
const router = Router();
const view = ProductView.getInstance();

// router.post("/", asyncWrapper(view.create));
router.get(
  "/",
  asyncWrapper(optionalAuthenticateUser),
  asyncWrapper(view.getAll)
);
router.get(
  "/top-rated",
  asyncWrapper(optionalAuthenticateUser),
  asyncWrapper(view.getAllTopRated)
);
router.post(
  "/fav/:productId",
  asyncWrapper(authenticateUser),
  asyncWrapper(view.toggleFavourite)
);
router.get(
  "/:id",
  asyncWrapper(optionalAuthenticateUser),
  asyncWrapper(view.getOneById)
);
router.get(
  "/:id/alike",
  asyncWrapper(optionalAuthenticateUser),
  asyncWrapper(view.getLike)
);
// router.put("/:id", asyncWrapper(view.update));
// router.delete("/:id", asyncWrapper(view.deleteOne));

export default router;
