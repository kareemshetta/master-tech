import { Router } from "express";
import dashboardRoutes from "./dashboard/cities.routes";
import webRoutes from "./website/cities.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
