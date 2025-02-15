import { Router } from "express";
import { StoresView } from "./stores.view";
import asyncWrapper from "../../../../utils/async-wrapper";

const router = Router();
const storeController = StoresView.getInstance();

router.get("/", asyncWrapper(storeController.getAll));
router.get("/high-rated", asyncWrapper(storeController.getAllHighRatedStores));
router.get("/:id", asyncWrapper(storeController.getOneById));

export default router;
