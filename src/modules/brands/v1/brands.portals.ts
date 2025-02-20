import { Router } from "express";
import dashboardRoutes from "./dashboard/brands.routes";
import webRoutes from "./website/brands.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
