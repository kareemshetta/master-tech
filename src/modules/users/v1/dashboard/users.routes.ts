import { Router } from "express";
import { UserView } from "./users.view";
import asyncWrapper from "../../../../utils/async-wrapper";

const router = Router();
const view = UserView.getInstance();

router
  .route("/")
  .post(asyncWrapper(view.createUser))
  .get(asyncWrapper(view.getAll));

router
  .route("/:id")

  .get(asyncWrapper(view.getOneById))
  .delete(asyncWrapper(view.deleteOne));

export default router;
