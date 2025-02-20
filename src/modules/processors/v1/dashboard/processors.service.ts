import { CountOptions, FindAndCountOptions, FindOptions, Op } from "sequelize";
import { IProcessor } from "../../../../utils/shared.types";

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

  public async create(data: IProcessor) {
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
  public validateCreateOrUpdate(data: any) {
    const schema = Joi.object({
      type: Joi.string().trim().required().messages({
        "string.base": "type must be a string.",
        "string.empty": "type cannot be empty.",
        "any.required": "type is required and cannot be null.",
      }),

      details: Joi.string().trim().optional().messages({
        "string.base": "details must be a string.",
        "string.empty": "details cannot be empty.",
        "any.required": "details is required and cannot be null.",
      }),

      noOfCores: Joi.string().optional().messages({}),
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
