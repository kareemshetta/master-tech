"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = exports.authenticateUser = void 0;
const passport_1 = __importDefault(require("passport"));
const authenticateUser = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false })(req, res, next);
};
exports.authenticateUser = authenticateUser;
const authenticateAdmin = (req, res, next) => {
    passport_1.default.authenticate("jwt-admin", { session: false })(req, res, next);
};
exports.authenticateAdmin = authenticateAdmin;
