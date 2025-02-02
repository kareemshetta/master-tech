"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_routes_1 = __importDefault(require("./dashboard/categories.routes"));
const portalRouter = (0, express_1.Router)();
portalRouter.use("/dashboard", categories_routes_1.default);
// portalRouter.use("/website", webRoutes);
exports.default = portalRouter;
