"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const async_wrapper_1 = __importDefault(require("../../../../utils/async-wrapper"));
const brands_view_1 = require("../dashboard/brands.view");
const router = (0, express_1.Router)();
const view = brands_view_1.BrandView.getInstance();
router.get("/", (0, async_wrapper_1.default)(view.getAll));
exports.default = router;
