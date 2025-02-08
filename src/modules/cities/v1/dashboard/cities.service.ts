import { FindAndCountOptions, FindOptions } from "sequelize";
import { ICity } from "../../../../utils/shared.types";
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

  public async create(data: ICity) {
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

  public validateCreate(data: ICity) {
    const schema = Joi.object({
      name: Joi.string().trim().max(255).required().messages({
        "string.base": " name must be a string.",
        "string.empty": " name cannot be empty.",
        "string.max": " name cannot exceed 255 characters.",
        "any.required": " name is required and cannot be null.",
      }),
      nameAr: Joi.string().trim().max(255).required().messages({
        "string.base": " nameAr must be a string.",
        "string.empty": " nameAr cannot be empty.",
        "string.max": " nameAr cannot exceed 255 characters.",
        "any.required": " nameAr is required and cannot be null.",
      }),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateUpdate(data: Partial<ICity>) {
    const schema = Joi.object({
      name: Joi.string().trim().max(255).required().messages({
        "string.base": " name must be a string.",
        "string.empty": " name cannot be empty.",
        "string.max": " name cannot exceed 255 characters.",
        "any.required": " name is required and cannot be null.",
      }),
      nameAr: Joi.string().trim().max(255).required().messages({
        "string.base": " nameAr must be a string.",
        "string.empty": " nameAr cannot be empty.",
        "string.max": " nameAr cannot exceed 255 characters.",
        "any.required": " nameAr is required and cannot be null.",
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
