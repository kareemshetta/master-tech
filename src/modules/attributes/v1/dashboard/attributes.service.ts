import { FindAndCountOptions, FindOptions } from "sequelize";
import { IAttributes } from "../../../../utils/shared.types";
import ProductAttributesRepository from "../attributes.repository";
import Joi from "joi";
import { ValidationError } from "../../../../utils/appError";
import { ProductAttributesEnum } from "../../../../utils/enums";

export class AttributeService {
  private static instance: AttributeService | null = null;
  private repo: ProductAttributesRepository;

  private constructor() {
    this.repo = ProductAttributesRepository.getInstance();
  }

  public static getInstance(): AttributeService {
    if (!AttributeService.instance) {
      AttributeService.instance = new AttributeService();
    }
    return AttributeService.instance;
  }

  public async create(data: IAttributes) {
    return this.repo.create(data);
  }

  public async delete(id: string) {
    return this.repo.delete({ where: { id: id } });
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

  public validateCreate(data: IAttributes) {
    const schema = Joi.object({
      type: Joi.string()
        .trim()
        .valid(...Object.values(ProductAttributesEnum))

        .required()
        .messages({
          "string.base": "type must be a string.",
          "string.empty": "type cannot be empty.",

          "any.required": "type is required and cannot be null.",
        }),

      value: Joi.string().trim().required().messages({
        "string.base": "value must be a string.",
        "string.max": "value cannot exceed 1000 characters.",
      }),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateUpdate(data: Partial<IAttributes>) {
    const schema = Joi.object({
      type: Joi.string()
        .trim()
        .valid(...Object.values(ProductAttributesEnum))

        .required()
        .messages({
          "string.base": "type must be a string.",
          "string.empty": "type cannot be empty.",

          "any.required": "type is required and cannot be null.",
        }),

      value: Joi.string().trim().required().messages({
        "string.base": "value must be a string.",
        "string.max": "value cannot exceed 1000 characters.",
      }),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateGetAllQuery(query: { search?: any; storeIds?: any }) {
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

export default AttributeService;
