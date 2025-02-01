import { Router } from "express";
import { StoresView } from "./stores.view";
import asyncWrapper from "../../../../utils/async-wrapper";

const router = Router();
const view = StoresView.getInstance();

router.post("/", asyncWrapper(view.createStore));
router.get("/", asyncWrapper(view.getAll));
router.get("/:id", asyncWrapper(view.getOneById));
router.put("/:id", asyncWrapper(view.updateStore));
router.delete("/:id", asyncWrapper(view.deleteOne));

export default router;
