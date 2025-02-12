"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admins_routes_1 = __importDefault(require("./dashboard/admins.routes"));
const portalRouter = (0, express_1.Router)();
portalRouter.use("/dashboard", admins_routes_1.default);
exports.default = portalRouter;
