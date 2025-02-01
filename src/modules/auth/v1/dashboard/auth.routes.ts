import { Router } from "express";
import asyncWrapper from "../../../../utils/async-wrapper";
import { AuthView } from "./auth.view";
import { authenticateAdmin } from "../../../../middlewares/auth.middleware";

const router = Router();
const view = AuthView.getInstance();

router.route("/sign_up").post(asyncWrapper(view.signUp));

router.route("/login").post(asyncWrapper(view.loginUser));

router
  .route("/get_my_profile")
  .get(asyncWrapper(authenticateAdmin), asyncWrapper(view.getOneById))
  .delete(asyncWrapper(view.deleteOne));

export default router;
