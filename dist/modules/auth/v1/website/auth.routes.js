"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const async_wrapper_1 = __importDefault(require("../../../../utils/async-wrapper"));
const auth_view_1 = require("./auth.view");
const auth_middleware_1 = require("../../../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const view = auth_view_1.AuthView.getInstance();
router.route("/sign_up").post((0, async_wrapper_1.default)(view.signUp));
router.route("/login").post((0, async_wrapper_1.default)(view.loginUser));
router.route("/forget_password").post((0, async_wrapper_1.default)(view.getOtp));
router.route("/verfiy_otp").post((0, async_wrapper_1.default)(view.verfiyOtp));
router.route("/update_password").put((0, async_wrapper_1.default)(view.updatePassword));
router
    .route("/get_my_profile")
    .get((0, async_wrapper_1.default)(auth_middleware_1.authenticateUser), (0, async_wrapper_1.default)(view.getOneById))
    .delete((0, async_wrapper_1.default)(view.deleteOne));
router.put("/update_my_profile", (0, async_wrapper_1.default)(auth_middleware_1.authenticateUser), (0, async_wrapper_1.default)(view.update));
exports.default = router;
