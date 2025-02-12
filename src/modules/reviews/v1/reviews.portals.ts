import { Router } from "express";
import dashboardRoutes from "./dashboard/reviews.routes";
import webRoutes from "./website/reviews.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
