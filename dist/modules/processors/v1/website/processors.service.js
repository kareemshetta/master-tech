"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessorService = void 0;
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../../../../utils/appError");
const product_processor_repository_1 = __importDefault(require("../../../products/v1/product.processor.repository"));
const enums_1 = require("../../../../utils/enums");
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
    validateCreate(data) {
        const schema = joi_1.default.object({
            firstName: joi_1.default.string().trim().required().messages({
                "string.base": "First name must be a string.",
                "string.empty": "First name cannot be empty.",
                "any.required": "First name is required and cannot be null.",
            }),
            lastName: joi_1.default.string().trim().required().messages({
                "string.base": "Last name must be a string.",
                "string.empty": "Last name cannot be empty.",
                "any.required": "Last name is required and cannot be null.",
            }),
            email: joi_1.default.string().email().required().messages({
                "string.email": "Email must be a valid email address.",
                "string.base": "Email must be a string.",
            }),
            phoneNumber: joi_1.default.string().required().messages({
                "string.base": "Phone number must be a string.",
            }),
            contactType: joi_1.default.string()
                .valid(...Object.values(enums_1.ContactType))
                .required()
                .messages({
                "any.only": `Contact type must be one of: ${Object.values(enums_1.ContactType).join(", ")}`,
                "any.required": "Contact type is required.",
            }),
            message: joi_1.default.string().trim().required().messages({
                "string.base": "Message must be a string.",
                "string.empty": "Message cannot be empty.",
                "any.required": "Message is required and cannot be null.",
            }),
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
