import { Router } from "express";
import dashboardRoutes from "./dashboard/aboutus.routes";
import webRoutes from "./website/aboutus.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
