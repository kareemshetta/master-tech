"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploads_routes_1 = __importDefault(require("./dashboard/uploads.routes"));
const uploads_routes_2 = __importDefault(require("./website/uploads.routes"));
const portalRouter = (0, express_1.Router)();
portalRouter.use("/dashboard", uploads_routes_1.default);
portalRouter.use("/website", uploads_routes_2.default);
exports.default = portalRouter;
