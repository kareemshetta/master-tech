import { Router } from "express";
import webRoutes from "./website/processors.routes";

const portalRouter = Router();

portalRouter.use("/website", webRoutes);

export default portalRouter;
