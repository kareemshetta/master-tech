"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const admins_repository_1 = __importDefault(require("../admins.repository"));
const joi_1 = __importDefault(require("joi"));
const constant_1 = require("../../../../utils/constant");
const appError_1 = require("../../../../utils/appError");
class AdminService {
    constructor() {
        this.userRepository = admins_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!AdminService.instance) {
            AdminService.instance = new AdminService();
        }
        return AdminService.instance;
    }
    async create(data) {
        return this.userRepository.create(data);
    }
    async delete(userId) {
        return this.userRepository.delete({ where: { id: userId } });
    }
    async findOneByIdOrThrowError(trainerId, options = {}) {
        return this.userRepository.findOneByIdOrThrowError(trainerId, options);
    }
    async findOne(options = {}) {
        return this.userRepository.findOne(options);
    }
    async getAll(options = {}) {
        return this.userRepository.findAndCountAll(options);
    }
    validateCreateUser(data) {
        const schema = joi_1.default.object({
            image: joi_1.default.string()
                .trim()
                .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
                .messages({
                "string.base": "image must be a string.",
                "string.empty": "image cannot be empty.",
                "string.uri": "image must be a valid URI.",
                "string.pattern.base": "image must have a valid file extension (jpg, jpeg, png).",
                "any.required": "image is required and cannot be null.",
            })
                .required(),
            firstName: joi_1.default.string().trim().max(50).min(1).required(),
            lastName: joi_1.default.string().trim().max(50).min(1).required(),
            email: joi_1.default.string().max(255).email().required(),
            phoneNumber: joi_1.default.string()
                .regex(constant_1.PHONE_NUMBER_VALIDATION)
                .required()
                .messages({
                "string.base": "phoneNumber must be a string.",
                "string.empty": "phoneNumber cannot be empty.",
                "string.pattern.base": "Please enter a valid Phone Number.",
                "any.required": "phoneNumber is required and cannot be null.",
            }),
            gender: joi_1.default.string().valid("MALE", "FEMALE", "OTHER").allow(""),
            birthDate: joi_1.default.date().iso().allow(""),
            password: joi_1.default.string()
                .regex(constant_1.PASSWORD_VALIDATION)
                .min(8)
                .messages({
                "string.base": "Password must be a string.",
                "string.empty": "Password cannot be empty.",
                "string.min": "Password must be at least 8 characters long.",
                "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one special character.",
                "any.required": "Password is required and cannot be null.",
            })
                .required(),
            confirmPassword: joi_1.default.string()
                .equal(joi_1.default.ref("password"))
                .regex(constant_1.PASSWORD_VALIDATION)
                .required()
                .min(8)
                .messages({
                "string.base": "Password must be a string.",
                "string.empty": "Password cannot be empty.",
                "string.min": "Password must be at least 8 characters long.",
                "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one special character.",
                "any.required": "Password is required and cannot be null.",
            }),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateLoginUser(data) {
        const schema = joi_1.default.object({
            email: joi_1.default.string().max(255).email().required(),
            password: joi_1.default.string()
                .regex(constant_1.PASSWORD_VALIDATION)
                .min(8)
                .messages({
                "string.base": "Password must be a string.",
                "string.empty": "Password cannot be empty.",
                "string.min": "Password must be at least 8 characters long.",
                "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, and one special character.",
                "any.required": "Password is required and cannot be null.",
            })
                .required(),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
}
exports.AdminService = AdminService;
AdminService.instance = null;
exports.default = AdminService;
