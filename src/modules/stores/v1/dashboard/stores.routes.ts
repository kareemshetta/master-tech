import { Router } from "express";
import { StoresView } from "./stores.view";
import asyncWrapper from "../../../../utils/async-wrapper";
import { authenticateAdmin } from "../../../../middlewares/auth.middleware";
import { authorizeSuperAdmin } from "../../../../middlewares/authorize.midddleware";

const router = Router();
const view = StoresView.getInstance();
router.use(asyncWrapper(authenticateAdmin));
router.post(
  "/",
  asyncWrapper(authorizeSuperAdmin),
  asyncWrapper(view.createStore)
);
router.get("/", asyncWrapper(authorizeSuperAdmin), asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
router.put(
  "/:id",
  asyncWrapper(authorizeSuperAdmin),
  asyncWrapper(view.updateStore)
);
router.delete(
  "/:id",
  asyncWrapper(authorizeSuperAdmin),
  asyncWrapper(view.deleteOne)
);

export default router;
