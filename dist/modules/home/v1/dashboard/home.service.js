"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeService = void 0;
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../../../../utils/appError");
const home_repository_1 = __importDefault(require("../home.repository"));
class HomeService {
    constructor() {
        this.repo = home_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!HomeService.instance) {
            HomeService.instance = new HomeService();
        }
        return HomeService.instance;
    }
    async create(data) {
        this.validateCreate(data);
        return this.repo.create(data);
    }
    async update(id, data) {
        this.validateUpdate(data);
        return this.repo.update(data, { where: { id } });
    }
    async delete(id) {
        return this.repo.delete({ where: { id } });
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
    getSectionValidationSchema() {
        return joi_1.default.array().items(joi_1.default.object({
            title: joi_1.default.string().trim().required().messages({
                "string.base": "Section title must be a string",
                "string.empty": "Section title cannot be empty",
                "any.required": "Section title is required",
            }),
            titleAr: joi_1.default.string().trim().required().messages({
                "string.base": "Section title in Arabic must be a string",
                "string.empty": "Section title in Arabic cannot be empty",
                "any.required": "Section title in Arabic is required",
            }),
            subtitle: joi_1.default.string().trim().required().messages({
                "string.base": "Section subtitle must be a string",
                "string.empty": "Section subtitle cannot be empty",
                "any.required": "Section subtitle is required",
            }),
            subtitleAr: joi_1.default.string().trim().required().messages({
                "string.base": "Section subtitle in Arabic must be a string",
                "string.empty": "Section subtitle in Arabic cannot be empty",
                "any.required": "Section subtitle in Arabic is required",
            }),
        }));
    }
    validateCreate(data) {
        const schema = joi_1.default.object({
            title: joi_1.default.string().trim().required().messages({
                "string.base": "Title must be a string",
                "string.empty": "Title cannot be empty",
                "any.required": "Title is required",
            }),
            titleAr: joi_1.default.string().trim().required().messages({
                "string.base": "Title in Arabic must be a string",
                "string.empty": "Title in Arabic cannot be empty",
                "any.required": "Title in Arabic is required",
            }),
            sections: this.getSectionValidationSchema().required().messages({
                "any.required": "Sections are required",
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
            title: joi_1.default.string().trim(),
            titleAr: joi_1.default.string().trim(),
            sections: this.getSectionValidationSchema(),
        }).min(1);
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
}
exports.HomeService = HomeService;
HomeService.instance = null;
exports.default = HomeService;
