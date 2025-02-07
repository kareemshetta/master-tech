import { Router } from "express";
import { AdminView } from "./admins.view";
import asyncWrapper from "../../../../utils/async-wrapper";
import { authenticateAdmin } from "../../../../middlewares/auth.middleware";
import {
  authorizeSuperAdmin,
  isSameUser,
} from "../../../../middlewares/authorize.midddleware";
const router = Router();
const view = AdminView.getInstance();
router.use(asyncWrapper(authenticateAdmin));
router
  .route("/")
  .post(asyncWrapper(authorizeSuperAdmin), asyncWrapper(view.createAdmin))
  .get(asyncWrapper(view.getAll));

router
  .route("/:id")
  .get(asyncWrapper(isSameUser), asyncWrapper(view.getOneById))
  .put(asyncWrapper(isSameUser), asyncWrapper(view.update))
  .delete(asyncWrapper(isSameUser), asyncWrapper(view.deleteOne));

export default router;
