import { Router } from "express";
import dashboardRoutes from "./dashboard/uploads.routes";
import webRoutes from "./website/uploads.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
