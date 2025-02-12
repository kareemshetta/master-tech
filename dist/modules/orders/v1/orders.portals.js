"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_routes_1 = __importDefault(require("./website/orders.routes"));
const orders_routes_2 = __importDefault(require("./dashboard/orders.routes"));
const portalRouter = (0, express_1.Router)();
portalRouter.use("/dashboard", orders_routes_2.default);
portalRouter.use("/website", orders_routes_1.default);
exports.default = portalRouter;
