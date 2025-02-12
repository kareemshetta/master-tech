"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_portals_1 = __importDefault(require("./v1/users.portals"));
const versionRouter = (0, express_1.Router)();
versionRouter.use("/v1", users_portals_1.default);
exports.default = versionRouter;
