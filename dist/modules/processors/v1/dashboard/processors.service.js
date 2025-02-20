"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessorService = void 0;
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../../../../utils/appError");
const product_processor_repository_1 = __importDefault(require("../../../products/v1/product.processor.repository"));
class ProcessorService {
    constructor() {
        this.repo = product_processor_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!ProcessorService.instance) {
            ProcessorService.instance = new ProcessorService();
        }
        return ProcessorService.instance;
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
    validateCreateOrUpdate(data) {
        const schema = joi_1.default.object({
            type: joi_1.default.string().trim().required().messages({
                "string.base": "type must be a string.",
                "string.empty": "type cannot be empty.",
                "any.required": "type is required and cannot be null.",
            }),
            details: joi_1.default.string().trim().optional().messages({
                "string.base": "details must be a string.",
                "string.empty": "details cannot be empty.",
                "any.required": "details is required and cannot be null.",
            }),
            noOfCores: joi_1.default.string().optional().messages({}),
        });
        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
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
exports.ProcessorService = ProcessorService;
ProcessorService.instance = null;
exports.default = ProcessorService;
