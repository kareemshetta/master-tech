import { Router } from "express";

import portalRoutes from "./v1/home.portals";

const versionRouter = Router();

versionRouter.use("/v1", portalRoutes);

export default versionRouter;
