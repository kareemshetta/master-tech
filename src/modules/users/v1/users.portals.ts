import { Router } from "express";
import dashboardRoutes from "./dashboard/users.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);
// portalRouter.use("/mobile", mobileRoutes);
// portalRouter.use("/integration", integrationRoutes);

export default portalRouter;
