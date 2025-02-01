import { Router } from "express";
import dashboardRoutes from "./dashboard/categories.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
// portalRouter.use("/website", webRoutes);

export default portalRouter;
