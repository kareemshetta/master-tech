import { Router } from "express";
import webRoutes from "./website/carts.routes";

const portalRouter = Router();

// portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", webRoutes);

export default portalRouter;
