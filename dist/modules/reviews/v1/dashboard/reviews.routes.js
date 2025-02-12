"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const async_wrapper_1 = __importDefault(require("../../../../utils/async-wrapper"));
const reviews_view_1 = require("./reviews.view");
const auth_middleware_1 = require("../../../../middlewares/auth.middleware");
const authorize_midddleware_1 = require("../../../../middlewares/authorize.midddleware");
const router = (0, express_1.Router)();
const view = reviews_view_1.ReviewView.getInstance();
router.use((0, async_wrapper_1.default)(auth_middleware_1.authenticateAdmin));
// router.post("/", asyncWrapper(authorizeSuperAdmin), asyncWrapper(view.create));
router.get("/all/:productId", (0, async_wrapper_1.default)(view.getAll));
router.get("/:id", (0, async_wrapper_1.default)(view.getOneById));
// router.put(
//   "/:id",
//   asyncWrapper(authorizeSuperAdmin),
//   asyncWrapper(view.update)
// );
router.delete("/:id", (0, async_wrapper_1.default)(authorize_midddleware_1.authorizeSuperAdmin), (0, async_wrapper_1.default)(view.deleteOne));
exports.default = router;
