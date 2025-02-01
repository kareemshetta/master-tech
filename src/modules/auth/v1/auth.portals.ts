import { Router } from "express";
import websiteRoutes from "./website/auth.routes";
import dashboardRoutes from "./dashboard/auth.routes";

const portalRouter = Router();

portalRouter.use("/website", websiteRoutes);
portalRouter.use("/dashboard", dashboardRoutes);
// portalRouter.use("/integration", integrationRoutes);

export default portalRouter;
