import { CountOptions, FindAndCountOptions, FindOptions } from "sequelize";
import { IContactUs } from "../../../../utils/shared.types";

import Joi from "joi";
import { ValidationError } from "../../../../utils/appError";
import ProductProcessorRepository from "../../../products/v1/product.processor.repository";
import { ContactType } from "../../../../utils/enums";

export class ProcessorService {
  private static instance: ProcessorService | null = null;
  private repo: ProductProcessorRepository;

  private constructor() {
    this.repo = ProductProcessorRepository.getInstance();
  }

  public static getInstance(): ProcessorService {
    if (!ProcessorService.instance) {
      ProcessorService.instance = new ProcessorService();
    }
    return ProcessorService.instance;
  }

  public async create(data: IContactUs) {
    return this.repo.create(data);
  }

  public async delete(catId: string) {
    return this.repo.delete({ where: { id: catId } });
  }

  public async findOneByIdOrThrowError(
    catId: string,
    options: FindOptions = {}
  ) {
    return this.repo.findOneByIdOrThrowError(catId, options);
  }

  public async findOne(options: FindOptions = {}) {
    return this.repo.findOne(options);
  }

  public async getAll(options: FindAndCountOptions = {}) {
    return this.repo.findAndCountAll(options);
  }

  public async count(options: CountOptions = {}) {
    return this.repo.count(options);
  }
  public validateCreate(data: any) {
    const schema = Joi.object({
      firstName: Joi.string().trim().required().messages({
        "string.base": "First name must be a string.",
        "string.empty": "First name cannot be empty.",
        "any.required": "First name is required and cannot be null.",
      }),

      lastName: Joi.string().trim().required().messages({
        "string.base": "Last name must be a string.",
        "string.empty": "Last name cannot be empty.",
        "any.required": "Last name is required and cannot be null.",
      }),

      email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address.",
        "string.base": "Email must be a string.",
      }),

      phoneNumber: Joi.string().required().messages({
        "string.base": "Phone number must be a string.",
      }),

      contactType: Joi.string()
        .valid(...Object.values(ContactType))
        .required()
        .messages({
          "any.only": `Contact type must be one of: ${Object.values(
            ContactType
          ).join(", ")}`,
          "any.required": "Contact type is required.",
        }),

      message: Joi.string().trim().required().messages({
        "string.base": "Message must be a string.",
        "string.empty": "Message cannot be empty.",
        "any.required": "Message is required and cannot be null.",
      }),
    });

    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      throw new ValidationError(error.message);
    }
  }

  public validateGetAllStoresQuery(query: { search?: any }) {
    const schema = Joi.object({
      search: Joi.string().trim().max(255).allow("").messages({
        "string.base": "Search term must be a string.",
        "string.max": "Search term cannot exceed 255 characters.",
      }),
    });

    const { error } = schema.validate(query);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }
}

export default ProcessorService;
