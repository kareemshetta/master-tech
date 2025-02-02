"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const categories_repository_1 = __importDefault(require("../categories.repository"));
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../../../../utils/appError");
class CategoryService {
    constructor() {
        this.repo = categories_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!CategoryService.instance) {
            CategoryService.instance = new CategoryService();
        }
        return CategoryService.instance;
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
    validateCreate(data) {
        const schema = joi_1.default.object({
            image: joi_1.default.string()
                .trim()
                .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
                .messages({
                "string.base": "Image must be a string.",
                "string.empty": "Image cannot be empty.",
                "string.pattern.base": "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
                "any.required": "Image is required and cannot be null.",
            })
                .required(),
            name: joi_1.default.string().trim().max(255).required().messages({
                "string.base": "Store name must be a string.",
                "string.empty": "Store name cannot be empty.",
                "string.max": "Store name cannot exceed 255 characters.",
                "any.required": "Store name is required and cannot be null.",
            }),
            description: joi_1.default.string().trim().max(1000).allow("").messages({
                "string.base": "Description must be a string.",
                "string.max": "Description cannot exceed 1000 characters.",
            }),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateUpdate(data) {
        const schema = joi_1.default.object({
            image: joi_1.default.string()
                .trim()
                .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
                .messages({
                "string.base": "Image must be a string.",
                "string.pattern.base": "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
            }),
            name: joi_1.default.string().trim().max(255).messages({
                "string.base": "Store name must be a string.",
                "string.max": "Store name cannot exceed 255 characters.",
            }),
            description: joi_1.default.string().trim().max(1000).allow("").messages({
                "string.base": "Description must be a string.",
                "string.max": "Description cannot exceed 1000 characters.",
            }),
        });
        const { error } = schema.validate(data);
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
        });
        const { error } = schema.validate(query);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
}
exports.CategoryService = CategoryService;
CategoryService.instance = null;
exports.default = CategoryService;
