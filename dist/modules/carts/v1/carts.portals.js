"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carts_routes_1 = __importDefault(require("./website/carts.routes"));
const portalRouter = (0, express_1.Router)();
// portalRouter.use("/dashboard", dashboardRoutes);
portalRouter.use("/website", carts_routes_1.default);
exports.default = portalRouter;
