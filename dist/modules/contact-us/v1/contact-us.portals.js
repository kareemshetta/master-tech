"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_us_routes_1 = __importDefault(require("./dashboard/contact-us.routes"));
const contact_us_routes_2 = __importDefault(require("./website/contact-us.routes"));
const portalRouter = (0, express_1.Router)();
portalRouter.use("/dashboard", contact_us_routes_1.default);
portalRouter.use("/website", contact_us_routes_2.default);
exports.default = portalRouter;
