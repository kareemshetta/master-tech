"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_view_1 = require("./users.view");
const async_wrapper_1 = __importDefault(require("../../../../utils/async-wrapper"));
const router = (0, express_1.Router)();
const view = users_view_1.UserView.getInstance();
router
    .route("/")
    .post((0, async_wrapper_1.default)(view.createUser))
    .get((0, async_wrapper_1.default)(view.getAll));
router
    .route("/:id")
    .get((0, async_wrapper_1.default)(view.getOneById))
    .delete((0, async_wrapper_1.default)(view.deleteOne));
exports.default = router;
