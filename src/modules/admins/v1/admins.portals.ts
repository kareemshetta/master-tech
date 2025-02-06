import { Router } from "express";

import dashboardRoutes from "./dashboard/admins.routes";

const portalRouter = Router();

portalRouter.use("/dashboard", dashboardRoutes);

export default portalRouter;
