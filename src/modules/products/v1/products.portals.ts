import { Router } from "express";
import dashboardRoutes from "./dashboard/products.routes";
import webRoutes from "./website/products.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
