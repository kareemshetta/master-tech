"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./website/auth.routes"));
const auth_routes_2 = __importDefault(require("./dashboard/auth.routes"));
const portalRouter = (0, express_1.Router)();
portalRouter.use("/website", auth_routes_1.default);
portalRouter.use("/dashboard", auth_routes_2.default);
// portalRouter.use("/integration", integrationRoutes);
exports.default = portalRouter;
