import { Router } from "express";
import webRoutes from "./website/processors.routes";
import dashboardRoutes from "./dashboard/processors.routes";

const portalRouter = Router();

portalRouter.use("/website", webRoutes);
portalRouter.use("/dashboard", dashboardRoutes);

export default portalRouter;
