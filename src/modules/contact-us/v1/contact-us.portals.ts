import { Router } from "express";
import dashboardRoutes from "./dashboard/contact-us.routes";
import webRoutes from "./website/contact-us.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
