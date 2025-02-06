"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stores_view_1 = require("./stores.view");
const async_wrapper_1 = __importDefault(require("../../../../utils/async-wrapper"));
const auth_middleware_1 = require("../../../../middlewares/auth.middleware");
const authorize_midddleware_1 = require("../../../../middlewares/authorize.midddleware");
const router = (0, express_1.Router)();
const view = stores_view_1.StoresView.getInstance();
router.use((0, async_wrapper_1.default)(auth_middleware_1.authenticateAdmin));
router.post("/", (0, async_wrapper_1.default)(authorize_midddleware_1.authorizeSuperAdmin), (0, async_wrapper_1.default)(view.createStore));
router.get("/", (0, async_wrapper_1.default)(authorize_midddleware_1.authorizeSuperAdmin), (0, async_wrapper_1.default)(view.getAll));
router.get("/:id", (0, async_wrapper_1.default)(view.getOneById));
router.put("/:id", (0, async_wrapper_1.default)(authorize_midddleware_1.authorizeSuperAdmin), (0, async_wrapper_1.default)(view.updateStore));
router.delete("/:id", (0, async_wrapper_1.default)(authorize_midddleware_1.authorizeSuperAdmin), (0, async_wrapper_1.default)(view.deleteOne));
exports.default = router;
