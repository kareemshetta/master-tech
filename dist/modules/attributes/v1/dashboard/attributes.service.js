"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeService = void 0;
const attributes_repository_1 = __importDefault(require("../attributes.repository"));
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../../../../utils/appError");
const enums_1 = require("../../../../utils/enums");
class AttributeService {
    constructor() {
        this.repo = attributes_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!AttributeService.instance) {
            AttributeService.instance = new AttributeService();
        }
        return AttributeService.instance;
    }
    async create(data) {
        return this.repo.create(data);
    }
    async delete(id) {
        return this.repo.delete({ where: { id: id } });
    }
    async findOneByIdOrThrowError(id, options = {}) {
        return this.repo.findOneByIdOrThrowError(id, options);
    }
    async findOne(options = {}) {
        return this.repo.findOne(options);
    }
    async getAll(options = {}) {
        return this.repo.findAndCountAll(options);
    }
    validateCreate(data) {
        const schema = joi_1.default.object({
            type: joi_1.default.string()
                .trim()
                .valid(...Object.values(enums_1.ProductAttributesEnum))
                .required()
                .messages({
                "string.base": "type must be a string.",
                "string.empty": "type cannot be empty.",
                "any.required": "type is required and cannot be null.",
            }),
            value: joi_1.default.string().trim().required().messages({
                "string.base": "value must be a string.",
                "string.max": "value cannot exceed 1000 characters.",
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
            type: joi_1.default.string()
                .trim()
                .valid(...Object.values(enums_1.ProductAttributesEnum))
                .required()
                .messages({
                "string.base": "type must be a string.",
                "string.empty": "type cannot be empty.",
                "any.required": "type is required and cannot be null.",
            }),
            value: joi_1.default.string().trim().required().messages({
                "string.base": "value must be a string.",
                "string.max": "value cannot exceed 1000 characters.",
            }),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateGetAllQuery(query) {
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
exports.AttributeService = AttributeService;
AttributeService.instance = null;
exports.default = AttributeService;
