"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const async_wrapper_1 = __importDefault(require("../../../../utils/async-wrapper"));
const home_view_1 = require("./home.view");
const auth_middleware_1 = require("../../../../middlewares/auth.middleware");
const authorize_midddleware_1 = require("../../../../middlewares/authorize.midddleware");
const router = (0, express_1.Router)();
const view = home_view_1.HomeView.getInstance();
router.use((0, async_wrapper_1.default)(auth_middleware_1.authenticateAdmin));
router.post("/", (0, async_wrapper_1.default)(authorize_midddleware_1.authorizeSuperAdmin), (0, async_wrapper_1.default)(view.create));
router.get("/", (0, async_wrapper_1.default)(view.getOneForDashboard));
router.put("/:id", (0, async_wrapper_1.default)(authorize_midddleware_1.authorizeSuperAdmin), (0, async_wrapper_1.default)(view.update));
router.delete("/:id", (0, async_wrapper_1.default)(authorize_midddleware_1.authorizeSuperAdmin), (0, async_wrapper_1.default)(view.deleteOne));
exports.default = router;
