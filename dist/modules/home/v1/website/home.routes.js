"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const async_wrapper_1 = __importDefault(require("../../../../utils/async-wrapper"));
const home_view_1 = require("../dashboard/home.view");
const router = (0, express_1.Router)();
const view = home_view_1.HomeView.getInstance();
router.get("/", (0, async_wrapper_1.default)(view.getOneById));
exports.default = router;
