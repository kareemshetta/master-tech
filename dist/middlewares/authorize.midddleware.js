"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSameUser = exports.authorizeSuperAdmin = void 0;
const appError_1 = require("../utils/appError");
const authorizeSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === "superAdmin")
        return next();
    throw new appError_1.AppError("forbiden", 403);
};
exports.authorizeSuperAdmin = authorizeSuperAdmin;
const isSameUser = (req, res, next) => {
    const { id } = req.params;
    if (req.user && (req.user.id == id || req.user.role === "superAdmin"))
        return next();
    throw new appError_1.AppError("forbiden", 403);
};
exports.isSameUser = isSameUser;
