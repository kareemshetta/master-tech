"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const regions_routes_1 = __importDefault(require("./dashboard/regions.routes"));
const regions_routes_2 = __importDefault(require("./website/regions.routes"));
const portalRouter = (0, express_1.Router)();
portalRouter.use("/dashboard", regions_routes_1.default);
portalRouter.use("/website", regions_routes_2.default);
exports.default = portalRouter;
