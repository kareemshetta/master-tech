import { Router } from "express";
import dashboardRoutes from "./dashboard/regions.routes";
import webRoutes from "./website/regions.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
