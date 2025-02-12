"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const async_wrapper_1 = __importDefault(require("../../../../utils/async-wrapper"));
const regions_view_1 = require("./regions.view");
const router = (0, express_1.Router)();
const view = regions_view_1.RegionView.getInstance();
// router.post("/", asyncWrapper(view.create));
router.get("/", (0, async_wrapper_1.default)(view.getAll));
router.get("/:id", (0, async_wrapper_1.default)(view.getOneById));
// router.put("/:id", asyncWrapper(view.update));
// router.delete("/:id", asyncWrapper(view.deleteOne));
exports.default = router;
