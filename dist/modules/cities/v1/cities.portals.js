"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cities_routes_1 = __importDefault(require("./dashboard/cities.routes"));
const cities_routes_2 = __importDefault(require("./website/cities.routes"));
const portalRouter = (0, express_1.Router)();
portalRouter.use("/dashboard", cities_routes_1.default);
portalRouter.use("/website", cities_routes_2.default);
exports.default = portalRouter;
