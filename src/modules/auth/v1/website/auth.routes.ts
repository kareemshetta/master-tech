import { Router } from "express";
import asyncWrapper from "../../../../utils/async-wrapper";
import { AuthView } from "./auth.view";
import { authenticateUser } from "../../../../middlewares/auth.middleware";

const router = Router();
const view = AuthView.getInstance();

router.route("/sign_up").post(asyncWrapper(view.signUp));

router.route("/login").post(asyncWrapper(view.loginUser));

router.route("/forget_password").post(asyncWrapper(view.getOtp));

router.route("/verfiy_otp").post(asyncWrapper(view.verfiyOtp));

router.route("/update_password").put(asyncWrapper(view.updatePassword));
router
  .route("/get_my_profile")

  .get(asyncWrapper(authenticateUser), asyncWrapper(view.getOneById))
  .delete(asyncWrapper(view.deleteOne));

export default router;
