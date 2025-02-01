import { Router } from "express";
import dashboardRoutes from "./dashboard/stores.routes";
import webRoutes from "./website/stores.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
