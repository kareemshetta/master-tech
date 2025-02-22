"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const users_model_1 = __importDefault(require("../../models/users.model"));
const admins_model_1 = __importDefault(require("../../models/admins.model"));
const appError_1 = require("../../utils/appError");
const enums_1 = require("../../utils/enums");
const console_1 = require("console");
const carts_model_1 = __importDefault(require("../../models/carts.model"));
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT || "your-secret-key",
};
// Strategy for mobile users
passport_1.default.use("jwt", new passport_jwt_1.Strategy(jwtOptions, async (payload, done) => {
    try {
        const user = (await users_model_1.default.findByPk(payload.id, {
            include: [{ model: carts_model_1.default, attributes: ["id"] }],
        }))?.toJSON();
        if (!user) {
            const appError = new appError_1.AppError("unAuthorized", 401);
            return done(appError, false);
        }
        // Check if user is active/enabled
        if (user.status == enums_1.UserStatus.Suspended) {
            const error = new appError_1.AppError("unAuthorized", 401);
            return done(error, false);
        }
        return done(null, user);
    }
    catch (error) {
        const err = new appError_1.AppError("unAuthorized", 401);
        (0, console_1.log)(err);
        //   authError.status = 500;
        //   authError.code = "AUTH_FAILED";
        return done(err, false);
    }
}));
// Strategy for admin users
passport_1.default.use("jwt-admin", new passport_jwt_1.Strategy(jwtOptions, async (payload, done) => {
    try {
        const admin = (await admins_model_1.default.findByPk(payload.id))?.toJSON();
        if (!admin) {
            const appError = new appError_1.AppError("unAuthorized", 401);
            return done(appError, false);
        }
        // Check if admin is active/enabled
        if (admin.status == enums_1.UserStatus.Suspended) {
            const error = new appError_1.AppError("unAuthorized", 401);
            return done(error, false);
        }
        return done(null, admin);
    }
    catch (error) {
        return done(error, false);
    }
}));
exports.default = passport_1.default;
