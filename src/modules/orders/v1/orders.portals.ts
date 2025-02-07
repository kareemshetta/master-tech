import { Router } from "express";
import webRoutes from "./website/orders.routes";
import dashboardRoutes from "./dashboard/orders.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
