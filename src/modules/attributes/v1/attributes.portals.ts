import { Router } from "express";
import dashboardRoutes from "./dashboard/attributes.routes";
import webRoutes from "./website/attributes.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
