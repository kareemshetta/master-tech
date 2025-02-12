"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../../../../utils/appError");
const reviews_repository_1 = __importDefault(require("../reviews.repository"));
class ReviewService {
    constructor() {
        this.repo = reviews_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!ReviewService.instance) {
            ReviewService.instance = new ReviewService();
        }
        return ReviewService.instance;
    }
    async create(data) {
        return this.repo.create(data);
    }
    async delete(catId) {
        return this.repo.delete({ where: { id: catId } });
    }
    async findOneByIdOrThrowError(catId, options = {}) {
        return this.repo.findOneByIdOrThrowError(catId, options);
    }
    async findOne(options = {}) {
        return this.repo.findOne(options);
    }
    async getAll(options = {}) {
        return this.repo.findAndCountAll(options);
    }
    async count(options = {}) {
        return this.repo.count(options);
    }
    validateCreate(data) {
        const schema = joi_1.default.object({
            rating: joi_1.default.number().integer().min(1).max(5).required().messages({
                "number.base": "Rating must be a number.",
                "number.integer": "Rating must be an integer.",
                "number.min": "Rating must be at least 1.",
                "number.max": "Rating cannot exceed 5.",
                "any.required": "Rating is required and cannot be null.",
            }),
            message: joi_1.default.string().trim().required().messages({
                "string.base": "Message must be a string.",
                "string.empty": "Message cannot be empty.",
                "any.required": "Message is required and cannot be null.",
            }),
            userId: joi_1.default.string().required().messages({
                "string.base": "User ID must be a string.",
                "string.empty": "User ID cannot be empty.",
                "any.required": "User ID is required and cannot be null.",
            }),
            productId: joi_1.default.string().required().messages({
                "string.base": "Product ID must be a string.",
                "string.empty": "Product ID cannot be empty.",
                "any.required": "Product ID is required and cannot be null.",
            }),
        });
        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateUpdate(data) {
        const schema = joi_1.default.object({
            id: joi_1.default.string().uuid().required().messages({
                "string.base": "ID must be a string.",
                "string.guid": "ID must be a valid UUID.",
                "any.required": "ID is required and cannot be null.",
            }),
            rating: joi_1.default.number().integer().min(1).max(5).messages({
                "number.base": "Rating must be a number.",
                "number.integer": "Rating must be an integer.",
                "number.min": "Rating must be at least 1.",
                "number.max": "Rating cannot exceed 5.",
            }),
            message: joi_1.default.string().trim().messages({
                "string.base": "Message must be a string.",
                "string.empty": "Message cannot be empty.",
            }),
        });
        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateGetAllStoresQuery(query) {
        const schema = joi_1.default.object({
            search: joi_1.default.string().trim().max(255).allow("").messages({
                "string.base": "Search term must be a string.",
                "string.max": "Search term cannot exceed 255 characters.",
            }),
            productId: joi_1.default.string().uuid().required().messages({
                "string.base": "Product ID must be a string.",
                "string.guid": "Product ID must be a valid UUID.",
                "any.required": "Product ID is required and cannot be null.",
            }),
        });
        const { error } = schema.validate(query);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
}
exports.ReviewService = ReviewService;
ReviewService.instance = null;
exports.default = ReviewService;
