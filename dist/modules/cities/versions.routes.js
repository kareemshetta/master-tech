"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cities_portals_1 = __importDefault(require("./v1/cities.portals"));
const versionRouter = (0, express_1.Router)();
versionRouter.use("/v1", cities_portals_1.default);
exports.default = versionRouter;
