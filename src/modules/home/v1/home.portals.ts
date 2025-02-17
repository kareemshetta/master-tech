import { Router } from "express";
import dashboardRoutes from "./dashboard/home.routes";
import webRoutes from "./website/home.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
