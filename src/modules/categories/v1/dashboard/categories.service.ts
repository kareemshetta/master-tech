import { FindAndCountOptions, FindOptions } from "sequelize";
import { ICategory } from "../../../../utils/shared.types";
import CategoryRepository from "../categories.repository";
import Joi from "joi";
import { ValidationError } from "../../../../utils/appError";

export class CategoryService {
  private static instance: CategoryService | null = null;
  private repo: CategoryRepository;

  private constructor() {
    this.repo = CategoryRepository.getInstance();
  }

  public static getInstance(): CategoryService {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
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
      image: Joi.string()
        .trim()
        .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
        .messages({
          "string.base": "Image must be a string.",
          "string.empty": "Image cannot be empty.",
          "string.pattern.base":
            "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
          "any.required": "Image is required and cannot be null.",
        })
        .required(),

      name: Joi.string().trim().max(255).required().messages({
        "string.base": "name must be a string.",
        "string.empty": "name cannot be empty.",
        "string.max": "name cannot exceed 255 characters.",
        "any.required": "name is required and cannot be null.",
      }),
      nameAr: Joi.string().trim().max(255).required().messages({
        "string.base": "nameAr must be a string.",
        "string.empty": "nameAr cannot be empty.",
        "string.max": "nameAr cannot exceed 255 characters.",
        "any.required": "nameAr is required and cannot be null.",
      }),

      description: Joi.string().trim().max(1000).allow("").messages({
        "string.base": "Description must be a string.",
        "string.max": "Description cannot exceed 1000 characters.",
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
      image: Joi.string()
        .trim()
        .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
        .messages({
          "string.base": "Image must be a string.",
          "string.pattern.base":
            "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
        }),

      name: Joi.string().trim().max(255).messages({
        "string.base": "name must be a string.",
        "string.max": "name cannot exceed 255 characters.",
      }),
      nameAr: Joi.string().trim().max(255).messages({
        "string.base": "nameAr must be a string.",
        "string.max": "nameAr cannot exceed 255 characters.",
      }),

      description: Joi.string().trim().max(1000).allow("").messages({
        "string.base": "Description must be a string.",
        "string.max": "Description cannot exceed 1000 characters.",
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

export default CategoryService;
