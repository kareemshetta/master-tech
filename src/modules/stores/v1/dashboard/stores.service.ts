import { CountOptions, FindAndCountOptions, FindOptions } from "sequelize";
import { IStore } from "../../../../utils/shared.types";
import StoreRepository from "../stores.repository";
import Joi from "joi";
import { ValidationError } from "../../../../utils/appError";

export class StoreService {
  private static instance: StoreService | null = null;
  private storeRepository: StoreRepository;

  private constructor() {
    this.storeRepository = StoreRepository.getInstance();
  }

  public static getInstance(): StoreService {
    if (!StoreService.instance) {
      StoreService.instance = new StoreService();
    }
    return StoreService.instance;
  }

  public async create(data: IStore) {
    return this.storeRepository.create(data);
  }

  public async delete(storeId: string) {
    return this.storeRepository.delete({ where: { id: storeId } });
  }

  public async findOneByIdOrThrowError(
    storeId: string,
    options: FindOptions = {}
  ) {
    return this.storeRepository.findOneByIdOrThrowError(storeId, options);
  }

  public async findOne(options: FindOptions = {}) {
    return this.storeRepository.findOne(options);
  }

  public async getAll(options: FindAndCountOptions = {}) {
    return this.storeRepository.findAndCountAll(options);
  }

  public async getAllWithoutCount(options: FindAndCountOptions = {}) {
    return this.storeRepository.findAll(options);
  }

  public async count(options: CountOptions = {}) {
    return this.storeRepository.count(options);
  }

  public validateCreateStore(data: IStore) {
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
        "string.base": "Store name must be a string.",
        "string.empty": "Store name cannot be empty.",
        "string.max": "Store name cannot exceed 255 characters.",
        "any.required": "Store name is required and cannot be null.",
      }),
      nameAr: Joi.string().trim().max(255).required().messages({
        "string.base": "Store nameAr must be a string.",
        "string.empty": "Store nameAr cannot be empty.",
        "string.max": "Store nameAr cannot exceed 255 characters.",
        "any.required": "Store nameAr is required and cannot be null.",
      }),

      location: Joi.string().trim().max(255).allow("").messages({
        "string.base": "Location must be a string.",
        "string.max": "Location cannot exceed 255 characters.",
      }),

      description: Joi.string().trim().max(1000).allow("").messages({
        "string.base": "Description must be a string.",
        "string.max": "Description cannot exceed 1000 characters.",
      }),
      descriptionAr: Joi.string().trim().max(1000).allow("").messages({
        "string.base": "DescriptionAr must be a string.",
        "string.max": "DescriptionAr cannot exceed 1000 characters.",
      }),

      phoneNumber: Joi.string().trim().allow("").messages({
        "string.base": "Phone number must be a string.",
      }),
      parentId: Joi.string().uuid().trim().allow(null).messages({
        "string.base": "PparentId must be a string.",
      }),
      cityId: Joi.string().uuid().trim().allow(null).messages({
        "string.base": "cityId must be a string.",
      }),
      regionId: Joi.string().uuid().trim().allow(null).messages({
        "string.base": "cityId must be a string.",
      }),
      allowShipping: Joi.boolean().required().messages({
        "any.required": "allowShipping is required and cannot be null.",
      }),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateUpdateStore(data: Partial<IStore>) {
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
        "string.base": "Store name must be a string.",
        "string.max": "Store name cannot exceed 255 characters.",
      }),
      nameAr: Joi.string().trim().max(255).messages({
        "string.base": "Store nameAr must be a string.",
        "string.max": "Store nameAr cannot exceed 255 characters.",
      }),

      location: Joi.string().trim().max(255).allow("").messages({
        "string.base": "Location must be a string.",
        "string.max": "Location cannot exceed 255 characters.",
      }),

      description: Joi.string().trim().max(1000).allow("").messages({
        "string.base": "Description must be a string.",
        "string.max": "Description cannot exceed 1000 characters.",
      }),
      descriptionAr: Joi.string().trim().max(1000).allow("").messages({
        "string.base": "DescriptionAr must be a string.",
        "string.max": "DescriptionAr cannot exceed 1000 characters.",
      }),

      phoneNumber: Joi.string().trim().allow("").messages({
        "string.base": "Phone number must be a string.",
      }),
      parentId: Joi.string().uuid().trim().allow(null).messages({
        "string.base": "Phone number must be a string.",
      }),
      cityId: Joi.string().uuid().trim().allow(null).messages({
        "string.base": "cityId must be a string.",
      }),
      regionId: Joi.string().uuid().trim().allow(null).messages({
        "string.base": "cityId must be a string.",
      }),
      allowShipping: Joi.boolean().required().messages({
        "any.required": "allowShipping is required and cannot be null.",
      }),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateGetAllStoresQuery(query: {
    search?: any;
    storeIds?: any;
    cityId?: any;
    regionId?: any;
  }) {
    const schema = Joi.object({
      search: Joi.string().trim().max(255).allow("").messages({
        "string.base": "Search term must be a string.",
        "string.max": "Search term cannot exceed 255 characters.",
      }),
      cityId: Joi.string().uuid().trim().allow(null).messages({
        "string.base": "cityId must be a string.",
      }),
      regionId: Joi.string().uuid().trim().allow(null).messages({
        "string.base": "cityId must be a string.",
      }),
      storeIds: Joi.string()
        .custom((value: string, helpers) => {
          if (!value) return value;

          const ids = value.split(",").map((id) => id.trim());

          // Validate each ID using Joi's UUID validation
          const uuidSchema = Joi.string().uuid({ version: "uuidv4" });
          const invalidIds = ids.filter((id) => uuidSchema.validate(id).error);

          if (invalidIds.length > 0) {
            return helpers.error("any.invalid", {
              message: `Invalid UUID format for store IDs: ${invalidIds.join(
                ", "
              )}`,
            });
          }

          return value;
        })
        .allow("")
        .messages({
          "string.base": "Store IDs must be a comma-separated string of UUIDs.",
          "any.invalid": "Invalid UUID format in store IDs.",
        }),
    });

    const { error } = schema.validate(query);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }
}

export default StoreService;
