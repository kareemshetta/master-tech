"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityService = void 0;
const cities_repository_1 = __importDefault(require("../cities.repository"));
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../../../../utils/appError");
class CityService {
    constructor() {
        this.repo = cities_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!CityService.instance) {
            CityService.instance = new CityService();
        }
        return CityService.instance;
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
                "string.base": " name must be a string.",
                "string.empty": " name cannot be empty.",
                "string.max": " name cannot exceed 255 characters.",
                "any.required": " name is required and cannot be null.",
            }),
            nameAr: joi_1.default.string().trim().max(255).required().messages({
                "string.base": " nameAr must be a string.",
                "string.empty": " nameAr cannot be empty.",
                "string.max": " nameAr cannot exceed 255 characters.",
                "any.required": " nameAr is required and cannot be null.",
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
            name: joi_1.default.string().trim().max(255).required().messages({
                "string.base": " name must be a string.",
                "string.empty": " name cannot be empty.",
                "string.max": " name cannot exceed 255 characters.",
                "any.required": " name is required and cannot be null.",
            }),
            nameAr: joi_1.default.string().trim().max(255).required().messages({
                "string.base": " nameAr must be a string.",
                "string.empty": " nameAr cannot be empty.",
                "string.max": " nameAr cannot exceed 255 characters.",
                "any.required": " nameAr is required and cannot be null.",
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
exports.CityService = CityService;
CityService.instance = null;
exports.default = CityService;
