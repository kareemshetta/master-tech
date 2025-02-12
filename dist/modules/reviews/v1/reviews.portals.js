"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_routes_1 = __importDefault(require("./dashboard/reviews.routes"));
const reviews_routes_2 = __importDefault(require("./website/reviews.routes"));
const portalRouter = (0, express_1.Router)();
portalRouter.use("/dashboard", reviews_routes_1.default);
portalRouter.use("/website", reviews_routes_2.default);
exports.default = portalRouter;
