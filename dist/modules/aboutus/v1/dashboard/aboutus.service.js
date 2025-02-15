"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutusService = void 0;
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../../../../utils/appError");
const aboutus_repository_1 = __importDefault(require("../aboutus.repository"));
class AboutusService {
    constructor() {
        this.repo = aboutus_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!AboutusService.instance) {
            AboutusService.instance = new AboutusService();
        }
        return AboutusService.instance;
    }
    async create(data) {
        // this.validateCreate(data);
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
    getFaqValidationSchema() {
        return joi_1.default.array().items(joi_1.default.object({
            // id: Joi.string().uuid().required(),
            question: joi_1.default.string().trim().required().messages({
                "string.base": "Question must be a string",
                "string.empty": "Question cannot be empty",
                "any.required": "Question is required",
            }),
            questionAr: joi_1.default.string().trim().required().messages({
                "string.base": "Question in Arabic must be a string",
                "string.empty": "Question in Arabic cannot be empty",
                "any.required": "Question in Arabic is required",
            }),
            answer: joi_1.default.string().trim().required().messages({
                "string.base": "Answer must be a string",
                "string.empty": "Answer cannot be empty",
                "any.required": "Answer is required",
            }),
            answerAr: joi_1.default.string().trim().required().messages({
                "string.base": "Answer in Arabic must be a string",
                "string.empty": "Answer in Arabic cannot be empty",
                "any.required": "Answer in Arabic is required",
            }),
        }));
    }
    validateCreate(data) {
        const schema = joi_1.default.object({
            ourMessage: joi_1.default.string().trim().required().messages({
                "string.base": "Our Message must be a string",
                "string.empty": "Our Message cannot be empty",
                "any.required": "Our Message is required",
            }),
            ourMessageAr: joi_1.default.string().trim().required().messages({
                "string.base": "Our Message (Arabic) must be a string",
                "string.empty": "Our Message (Arabic) cannot be empty",
                "any.required": "Our Message (Arabic) is required",
            }),
            ourVision: joi_1.default.string().trim().required().messages({
                "string.base": "Our Vision must be a string",
                "string.empty": "Our Vision cannot be empty",
                "any.required": "Our Vision is required",
            }),
            ourVisionAr: joi_1.default.string().trim().required().messages({
                "string.base": "Our Vision (Arabic) must be a string",
                "string.empty": "Our Vision (Arabic) cannot be empty",
                "any.required": "Our Vision (Arabic) is required",
            }),
            whoAreWe: joi_1.default.string().trim().required().messages({
                "string.base": "Who We Are must be a string",
                "string.empty": "Who We Are cannot be empty",
                "any.required": "Who We Are is required",
            }),
            whoAreWeAr: joi_1.default.string().trim().required().messages({
                "string.base": "Who We Are (Arabic) must be a string",
                "string.empty": "Who We Are (Arabic) cannot be empty",
                "any.required": "Who We Are (Arabic) is required",
            }),
            faqs: this.getFaqValidationSchema(),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateUpdate(data) {
        const schema = joi_1.default.object({
            ourMessage: joi_1.default.string().trim(),
            ourMessageAr: joi_1.default.string().trim(),
            ourVision: joi_1.default.string().trim(),
            ourVisionAr: joi_1.default.string().trim(),
            whoAreWe: joi_1.default.string().trim(),
            whoAreWeAr: joi_1.default.string().trim(),
            faqs: this.getFaqValidationSchema(),
        }).min(1);
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
}
exports.AboutusService = AboutusService;
AboutusService.instance = null;
exports.default = AboutusService;
