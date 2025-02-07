"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.generateOrderId = exports.generateSecureOTP = exports.getNotIncludedIds = exports.checkArraysWithSet = exports.comparePassword = exports.generateToken = exports.isUUID = void 0;
exports.validateArrayOfUUID = validateArrayOfUUID;
exports.validateUUID = validateUUID;
exports.isNowGreaterThanBy15Minutes = isNowGreaterThanBy15Minutes;
const appError_1 = require("./appError");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const SALT = process.env.SALT;
function validateArrayOfUUID(uuidArray, message = "Invalid array of uuid") {
    for (let uuid of uuidArray) {
        validateUUID(uuid, message);
    }
}
function validateUUID(id, errorMessage) {
    if (!(0, exports.isUUID)(id)) {
        throw new appError_1.ValidationError(errorMessage || "invalid uuid");
    }
}
const isUUID = (value) => {
    return typeof value === "string" && (0, uuid_1.validate)(value);
};
exports.isUUID = isUUID;
const generateToken = (user, expiresIn = "24h") => {
    return jwt.sign(user, process.env.JWT || "secret", { expiresIn });
};
exports.generateToken = generateToken;
const comparePassword = (loginPassword, realPassword) => {
    return bcrypt_1.default.compare(loginPassword, realPassword);
};
exports.comparePassword = comparePassword;
const checkArraysWithSet = (array1, array2) => {
    return array1.every((element) => array2.includes(element));
};
exports.checkArraysWithSet = checkArraysWithSet;
const getNotIncludedIds = (array1, array2) => {
    return array1.filter((element) => !array2.includes(element));
};
exports.getNotIncludedIds = getNotIncludedIds;
const generateSecureOTP = (length = 5) => {
    return crypto_1.default
        .randomBytes(length)
        .map((x) => x % 10)
        .join("");
};
exports.generateSecureOTP = generateSecureOTP;
const generateOrderId = (length = 8) => {
    const prefix = "#ORD";
    const randomHex = crypto_1.default.randomBytes(length).toString("hex").toUpperCase();
    return `${prefix}-${randomHex}`;
};
exports.generateOrderId = generateOrderId;
function isNowGreaterThanBy15Minutes(targetDate) {
    const now = new Date(); // Current date and time
    const fifteenMinutesLater = new Date(targetDate.getTime() + 15 * 60 * 1000); // Add 15 minutes to the target date
    return now > fifteenMinutesLater;
}
const hashPassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(Number(SALT));
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
