"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admins_view_1 = require("./admins.view");
const async_wrapper_1 = __importDefault(require("../../../../utils/async-wrapper"));
const auth_middleware_1 = require("../../../../middlewares/auth.middleware");
const authorize_midddleware_1 = require("../../../../middlewares/authorize.midddleware");
const router = (0, express_1.Router)();
const view = admins_view_1.AdminView.getInstance();
router.use((0, async_wrapper_1.default)(auth_middleware_1.authenticateAdmin));
router
    .route("/")
    .post((0, async_wrapper_1.default)(authorize_midddleware_1.authorizeSuperAdmin), (0, async_wrapper_1.default)(view.createAdmin))
    .get((0, async_wrapper_1.default)(view.getAll));
router
    .route("/:id")
    .get((0, async_wrapper_1.default)(authorize_midddleware_1.isSameUser), (0, async_wrapper_1.default)(view.getOneById))
    .put((0, async_wrapper_1.default)(authorize_midddleware_1.isSameUser), (0, async_wrapper_1.default)(view.update))
    .delete((0, async_wrapper_1.default)(authorize_midddleware_1.isSameUser), (0, async_wrapper_1.default)(view.deleteOne));
exports.default = router;
