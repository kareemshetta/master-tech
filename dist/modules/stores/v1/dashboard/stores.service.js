"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreService = void 0;
const stores_repository_1 = __importDefault(require("../stores.repository"));
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../../../../utils/appError");
class StoreService {
    constructor() {
        this.storeRepository = stores_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!StoreService.instance) {
            StoreService.instance = new StoreService();
        }
        return StoreService.instance;
    }
    async create(data) {
        return this.storeRepository.create(data);
    }
    async delete(storeId) {
        return this.storeRepository.delete({ where: { id: storeId } });
    }
    async findOneByIdOrThrowError(storeId, options = {}) {
        return this.storeRepository.findOneByIdOrThrowError(storeId, options);
    }
    async findOne(options = {}) {
        return this.storeRepository.findOne(options);
    }
    async getAll(options = {}) {
        return this.storeRepository.findAndCountAll(options);
    }
    validateCreateStore(data) {
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
            location: joi_1.default.string().trim().max(255).allow("").messages({
                "string.base": "Location must be a string.",
                "string.max": "Location cannot exceed 255 characters.",
            }),
            description: joi_1.default.string().trim().max(1000).allow("").messages({
                "string.base": "Description must be a string.",
                "string.max": "Description cannot exceed 1000 characters.",
            }),
            phoneNumber: joi_1.default.string().trim().allow("").messages({
                "string.base": "Phone number must be a string.",
            }),
            parentId: joi_1.default.string().uuid().trim().allow(null).messages({
                "string.base": "PparentId must be a string.",
            }),
            cityId: joi_1.default.string().uuid().trim().allow(null).messages({
                "string.base": "cityId must be a string.",
            }),
            regionId: joi_1.default.string().uuid().trim().allow(null).messages({
                "string.base": "cityId must be a string.",
            }),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateUpdateStore(data) {
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
            location: joi_1.default.string().trim().max(255).allow("").messages({
                "string.base": "Location must be a string.",
                "string.max": "Location cannot exceed 255 characters.",
            }),
            description: joi_1.default.string().trim().max(1000).allow("").messages({
                "string.base": "Description must be a string.",
                "string.max": "Description cannot exceed 1000 characters.",
            }),
            phoneNumber: joi_1.default.string().trim().allow("").messages({
                "string.base": "Phone number must be a string.",
            }),
            parentId: joi_1.default.string().uuid().trim().allow(null).messages({
                "string.base": "Phone number must be a string.",
            }),
            cityId: joi_1.default.string().uuid().trim().allow(null).messages({
                "string.base": "cityId must be a string.",
            }),
            regionId: joi_1.default.string().uuid().trim().allow(null).messages({
                "string.base": "cityId must be a string.",
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
            cityId: joi_1.default.string().uuid().trim().allow(null).messages({
                "string.base": "cityId must be a string.",
            }),
            regionId: joi_1.default.string().uuid().trim().allow(null).messages({
                "string.base": "cityId must be a string.",
            }),
            storeIds: joi_1.default.string()
                .custom((value, helpers) => {
                if (!value)
                    return value;
                const ids = value.split(",").map((id) => id.trim());
                // Validate each ID using Joi's UUID validation
                const uuidSchema = joi_1.default.string().uuid({ version: "uuidv4" });
                const invalidIds = ids.filter((id) => uuidSchema.validate(id).error);
                if (invalidIds.length > 0) {
                    return helpers.error("any.invalid", {
                        message: `Invalid UUID format for store IDs: ${invalidIds.join(", ")}`,
                    });
                }
                return value;
            })
                .allow("")
                .messages({
                "string.base": "Store IDs must be a comma-separated string of UUIDs.",
                "any.invalid": "Invalid UUID format in store IDs.",
            }),
        });
        const { error } = schema.validate(query);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
}
exports.StoreService = StoreService;
StoreService.instance = null;
exports.default = StoreService;
