import { FindAndCountOptions, FindOptions } from "sequelize";
import Joi from "joi";
import { ValidationError } from "../../../../utils/appError";
import AboutusRepository from "../aboutus.repository";
import { IAboutus } from "../../../../utils/shared.types";

export class AboutusService {
  private static instance: AboutusService | null = null;
  private repo: AboutusRepository;

  private constructor() {
    this.repo = AboutusRepository.getInstance();
  }

  public static getInstance(): AboutusService {
    if (!AboutusService.instance) {
      AboutusService.instance = new AboutusService();
    }
    return AboutusService.instance;
  }

  public async create(data: IAboutus) {
    // this.validateCreate(data);
    return this.repo.create(data);
  }

  public async update(id: string, data: Partial<IAboutus>) {
    this.validateUpdate(data);
    return this.repo.update(data, { where: { id } });
  }

  public async delete(id: string) {
    return this.repo.delete({ where: { id } });
  }

  public async findOneByIdOrThrowError(id: string, options: FindOptions = {}) {
    return this.repo.findOneByIdOrThrowError(id, options);
  }

  public async findOne(options: FindOptions = {}) {
    return this.repo.findOne(options);
  }

  public async getAll(options: FindAndCountOptions = {}) {
    return this.repo.findAndCountAll(options);
  }

  private getFaqValidationSchema() {
    return Joi.array().items(
      Joi.object({
        // id: Joi.string().uuid().required(),
        question: Joi.string().trim().required().messages({
          "string.base": "Question must be a string",
          "string.empty": "Question cannot be empty",
          "any.required": "Question is required",
        }),
        questionAr: Joi.string().trim().required().messages({
          "string.base": "Question in Arabic must be a string",
          "string.empty": "Question in Arabic cannot be empty",
          "any.required": "Question in Arabic is required",
        }),
        answer: Joi.string().trim().required().messages({
          "string.base": "Answer must be a string",
          "string.empty": "Answer cannot be empty",
          "any.required": "Answer is required",
        }),
        answerAr: Joi.string().trim().required().messages({
          "string.base": "Answer in Arabic must be a string",
          "string.empty": "Answer in Arabic cannot be empty",
          "any.required": "Answer in Arabic is required",
        }),
      })
    );
  }

  public validateCreate(data: IAboutus) {
    const schema = Joi.object({
      ourMessage: Joi.string().trim().required().messages({
        "string.base": "Our Message must be a string",
        "string.empty": "Our Message cannot be empty",
        "any.required": "Our Message is required",
      }),
      ourMessageAr: Joi.string().trim().required().messages({
        "string.base": "Our Message (Arabic) must be a string",
        "string.empty": "Our Message (Arabic) cannot be empty",
        "any.required": "Our Message (Arabic) is required",
      }),
      ourVision: Joi.string().trim().required().messages({
        "string.base": "Our Vision must be a string",
        "string.empty": "Our Vision cannot be empty",
        "any.required": "Our Vision is required",
      }),
      ourVisionAr: Joi.string().trim().required().messages({
        "string.base": "Our Vision (Arabic) must be a string",
        "string.empty": "Our Vision (Arabic) cannot be empty",
        "any.required": "Our Vision (Arabic) is required",
      }),
      whoAreWe: Joi.string().trim().required().messages({
        "string.base": "Who We Are must be a string",
        "string.empty": "Who We Are cannot be empty",
        "any.required": "Who We Are is required",
      }),
      whoAreWeAr: Joi.string().trim().required().messages({
        "string.base": "Who We Are (Arabic) must be a string",
        "string.empty": "Who We Are (Arabic) cannot be empty",
        "any.required": "Who We Are (Arabic) is required",
      }),
      faqs: this.getFaqValidationSchema(),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateUpdate(data: Partial<IAboutus>) {
    const schema = Joi.object({
      ourMessage: Joi.string().trim(),
      ourMessageAr: Joi.string().trim(),
      ourVision: Joi.string().trim(),
      ourVisionAr: Joi.string().trim(),
      whoAreWe: Joi.string().trim(),
      whoAreWeAr: Joi.string().trim(),
      faqs: this.getFaqValidationSchema(),
    }).min(1);

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }
}

export default AboutusService;
