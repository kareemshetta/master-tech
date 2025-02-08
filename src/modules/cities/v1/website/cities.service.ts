import { FindAndCountOptions, FindOptions } from "sequelize";
import { ICategory } from "../../../../utils/shared.types";
import CityRepository from "../cities.repository";
import Joi from "joi";
import { ValidationError } from "../../../../utils/appError";

export class CityService {
  private static instance: CityService | null = null;
  private repo: CityRepository;

  private constructor() {
    this.repo = CityRepository.getInstance();
  }

  public static getInstance(): CityService {
    if (!CityService.instance) {
      CityService.instance = new CityService();
    }
    return CityService.instance;
  }

  public async create(data: ICategory) {
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

  public validateCreate(data: ICategory) {
    const schema = Joi.object({
      name: Joi.string().trim().max(255).required().messages({
        "string.base": "Store name must be a string.",
        "string.empty": "Store name cannot be empty.",
        "string.max": "Store name cannot exceed 255 characters.",
        "any.required": "Store name is required and cannot be null.",
      }),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateUpdate(data: Partial<ICategory>) {
    const schema = Joi.object({
      name: Joi.string().trim().max(255).messages({
        "string.base": "Store name must be a string.",
        "string.max": "Store name cannot exceed 255 characters.",
      }),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateGetAllStoresQuery(query: { search?: any; storeIds?: any }) {
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

export default CityService;
