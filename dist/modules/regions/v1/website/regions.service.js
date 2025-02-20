"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionService = void 0;
const regions_repository_1 = __importDefault(require("../regions.repository"));
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../../../../utils/appError");
class RegionService {
    constructor() {
        this.repo = regions_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!RegionService.instance) {
            RegionService.instance = new RegionService();
        }
        return RegionService.instance;
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
            name: joi_1.default.string().trim().max(255).required().messages({
                "string.base": "Store name must be a string.",
                "string.empty": "Store name cannot be empty.",
                "string.max": "Store name cannot exceed 255 characters.",
                "any.required": "Store name is required and cannot be null.",
            }),
            cityId: joi_1.default.string().trim().uuid().required().messages({
                "string.base": "City id must be a string.",
                "string.empty": "City id cannot be empty.",
                "any.required": "City id is required and cannot be null.",
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
            name: joi_1.default.string().trim().max(255).messages({
                "string.base": "Store name must be a string.",
                "string.max": "Store name cannot exceed 255 characters.",
            }),
            cityId: joi_1.default.string().trim().uuid().required().messages({
                "string.base": "City id must be a string.",
                "string.empty": "City id cannot be empty.",
                "any.required": "City id is required and cannot be null.",
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
exports.RegionService = RegionService;
RegionService.instance = null;
exports.default = RegionService;
