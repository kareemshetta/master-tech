import {
  CountOptions,
  FindAndCountOptions,
  FindOptions,
  Op,
  Transaction,
} from "sequelize";
import {
  IAttributes,
  ICategory,
  IProcessor,
  IProduct,
  IScreen,
} from "../../../../utils/shared.types";
import ProductSkuRepository from "../product.sku.repository";
import ProductScreenRepository from "../product.screen.repository";
import ProductProcessorRepository from "../product.processor.repository";
import ProductRepository from "../products.repository";

import Joi from "joi";
import { AppError, ValidationError } from "../../../../utils/appError";
import ProductAttributesRepository from "../../../attributes/v1/attributes.repository";
import sequelize from "../../../../config/db/config";
import {
  checkArraysWithSet,
  getNotIncludedIds,
} from "../../../../utils/generalFunctions";
import Category from "../../../../models/categories.model";
import { CategoryType } from "../../../../utils/enums";

export class PrdouctService {
  private static instance: PrdouctService | null = null;
  private productRepo: ProductRepository;
  private screenRepo: ProductScreenRepository;
  private processorRepo: ProductProcessorRepository;
  public attributesRepo: ProductAttributesRepository;
  private skuRepo: ProductSkuRepository;

  private constructor() {
    this.productRepo = ProductRepository.getInstance();
    this.screenRepo = ProductScreenRepository.getInstance();
    this.attributesRepo = ProductAttributesRepository.getInstance();
    this.processorRepo = ProductProcessorRepository.getInstance();
    this.skuRepo = ProductSkuRepository.getInstance();
  }

  public static getInstance(): PrdouctService {
    if (!PrdouctService.instance) {
      PrdouctService.instance = new PrdouctService();
    }
    return PrdouctService.instance;
  }

  public async create(data: IProduct) {
    let transaction: Transaction | null = null;
    try {
      transaction = await sequelize.transaction();

      const screen = (
        await this.screenRepo.create(data.screen, { transaction })
      ).toJSON() as IScreen;
      // const processor = (
      //   await this.processorRepo.create(data.processor, {
      //     transaction,
      //   })
      // ).toJSON() as IProcessor;

      const product = await this.productRepo.create(
        { ...data, screenId: screen.id },
        { transaction }
      );

      const productId = product.getDataValue("id");
      const skus = data.skus!.map((sku) => ({
        ...sku,
        productId,
      }));

      await this.skuRepo.bulkCreate(skus, { transaction });

      await transaction.commit();
      return product;
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  }

  public async createAccessory(data: IProduct) {
    const product = await this.productRepo.create(data);
    return product;
  }

  public async update(data: IProduct) {
    let transaction: Transaction | null = null;
    try {
      transaction = await sequelize.transaction();
      if (data.screen?.id) {
        await this.screenRepo.update(data.screen, {
          transaction,
          where: { id: data.screen.id },
        });
      }

      // if (data.processor?.id) {
      //   await this.processorRepo.update(data.processor, {
      //     transaction,
      //     where: { id: data.processor.id },
      //   });
      // }

      const product = await this.productRepo.update(
        { ...data },
        { transaction, where: { id: data.id }, returning: true }
      );

      if (data.skus && data.skus.length > 0) {
        await this.skuRepo.delete({
          where: { productId: data.id },
          transaction,
          force: true,
        });

        const productId = data.id;
        const skus = data.skus!.map((sku) => ({
          ...sku,
          productId,
        }));

        await this.skuRepo.bulkCreate(skus, { transaction });
      }

      await transaction.commit();
      return product;
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  }

  public async updateAccessory(data: IProduct) {
    // if (data.processor?.id) {
    //   await this.processorRepo.update(data.processor, {
    //     transaction,
    //     where: { id: data.processor.id },
    //   });
    // }

    const product = await this.productRepo.update(
      { ...data },
      { where: { id: data.id }, returning: true }
    );

    return product;
  }

  public async delete(id: string) {
    let transaction: Transaction | null = null;
    try {
      transaction = await sequelize.transaction();
      const deleted = this.productRepo.delete({
        where: { id: id },
        transaction,
      });
      await this.skuRepo.delete({
        where: { productId: id },
        transaction,
        force: true,
      });
      await transaction.commit();
      return deleted;
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  }

  public async findOneByIdOrThrowError(id: string, options: FindOptions = {}) {
    return this.productRepo.findOneByIdOrThrowError(id, options);
  }

  public async findOne(options: FindOptions = {}) {
    return this.productRepo.findOne(options);
  }

  public async getAll(options: FindAndCountOptions = {}) {
    return this.productRepo.findAndCountAll(options);
  }

  public validateCreate(data: IProduct) {
    const schema = Joi.object({
      screen: Joi.object({
        size: Joi.string().trim().required().messages({
          "string.base": "Screen size must be a string.",
          "string.empty": "Screen size cannot be empty.",
          "any.required": "Screen size is required and cannot be null.",
        }),
        refreshRate: Joi.string().trim().required().messages({
          "string.base": "Screen refresh rate must be a string.",
          "string.empty": "Screen refresh rate cannot be empty.",
          "any.required": "Screen refresh rate is required and cannot be null.",
        }),
        type: Joi.string().trim().required().messages({
          "string.base": "Screen type must be a string.",
          "string.empty": "Screen type cannot be empty.",
          "any.required": "Screen type is required and cannot be null.",
        }),
        pixelDensity: Joi.string().trim().required().messages({
          "string.base": "Screen pixel density must be a string.",
          "string.empty": "Screen pixel density cannot be empty.",
          "any.required":
            "Screen pixel density is required and cannot be null.",
        }),
        aspectRatio: Joi.string().trim().required().messages({
          "string.base": "Screen aspect ratio must be a string.",
          "string.empty": "Screen aspect ratio cannot be empty.",
          "any.required": "Screen aspect ratio is required and cannot be null.",
        }),
        details: Joi.string().trim().required().messages({
          "string.base": "Screen details must be a string.",
          "string.empty": "Screen details cannot be empty.",
          "any.required": "Screen details is required and cannot be null.",
        }),
      }),
      processorId: Joi.string().trim().uuid().required(),
      // processor: Joi.object({
      //   type: Joi.string().required().messages({
      //     "string.base": "Processor type must be a string.",
      //     "string.empty": "Processor type cannot be empty.",
      //     "any.required": "Processor type is required and cannot be null.",
      //   }),
      //   noOfCores: Joi.string().required().messages({
      //     "string.base": "Number of cores must be a string.",
      //     "string.empty": "Number of cores cannot be empty.",
      //     "any.required": "Number of cores is required and cannot be null.",
      //   }),
      //   details: Joi.string().required().messages({
      //     "string.base": "Processor details must be a string.",
      //     "string.empty": "Processor details cannot be empty.",
      //     "any.required": "Processor details is required and cannot be null.",
      //   }),
      // }),
      brandId: Joi.string().trim().uuid().required().messages({
        "string.base": "Brand id must be a string.",
        "string.empty": "Brand id cannot be empty.",
        "any.required": "Brand id is required and cannot be null.",
      }),
      // categoryId: Joi.string().trim().uuid().required().messages({
      //   "string.base": "Category id must be a string.",
      //   "string.empty": "Category id cannot be empty.",
      //   "any.required": "Category id is required and cannot be null.",
      // }),
      categoryType: Joi.string().valid(CategoryType.LAPTOP).required(),

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
      ram: Joi.number().min(1).max(200).required().messages({
        "number.base": "Ram must be a number.",
        "number.empty": "Ram cannot be empty.",
        "number.min": "Ram cannot be less than 1.",
        "number.max": "Ram cannot exceed 200.",
        "any.required": "Ram is required and cannot be null.",
      }),
      battery: Joi.number().min(300).max(500000).required().messages({
        "number.base": "Battery must be a number.",
        "number.empty": "Battery cannot be empty.",
        "number.min": "Battery cannot be less than 300.",
        "number.max": "Battery cannot exceed 5000.",
        "any.required": "Battery is required and cannot be null.",
      }),
      grantee: Joi.string().trim().required().messages({
        "string.base": "Grantee must be a string.",
        "string.empty": "Grantee cannot be empty.",
        "any.required": "Grantee is required and cannot be null.",
      }),
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
      descriptionAr: Joi.string().trim().max(1000).allow("").messages({
        "string.base": "DescriptionAr must be a string.",
        "string.max": "DescriptionAr cannot exceed 1000 characters.",
      }),
      basePrice: Joi.number().required().messages({
        "number.base": "Base price must be a number.",
        "number.empty": "Base price cannot be empty.",
        "any.required": "Base price is required and cannot be null.",
      }),
      discount: Joi.number().required().messages({
        "number.base": "Discount must be a number.",
        "number.empty": "Discount cannot be empty.",
        "any.required": "Discount is required and cannot be null.",
      }),
      storeId: Joi.string().uuid().required().messages({
        "string.base": "storeId must be a string.",
        "string.empty": "storeId cannot be empty.",
        "any.required": "storeId is required and cannot be null.",
      }),
      images: Joi.array().items(
        Joi.string()
          .trim()
          .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
          .messages({
            "string.base": "Image must be a string.",
            "string.empty": "Image cannot be empty.",
            "string.pattern.base":
              "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
            "any.required": "Image is required and cannot be null.",
          })
          .required()
      ),
      skus: Joi.array().items(
        Joi.object({
          sku: Joi.string().trim().required().messages({
            "string.base": "Sku must be a string.",
            "string.empty": "Sku cannot be empty.",
            "any.required": "Sku is required and cannot be null.",
          }),
          quantity: Joi.number().required().messages({
            "number.base": "Quantity must be a number.",
            "number.empty": "Quantity cannot be empty.",
            "any.required": "Quantity is required and cannot be null.",
          }),
          price: Joi.number().required().messages({
            "number.base": "Price must be a number.",
            "number.empty": "Price cannot be empty.",
            "any.required": "Price is required and cannot be null.",
          }),
          storageAttributeId: Joi.string().trim().uuid().required().messages({
            "string.base": "Storage attribute id must be a string.",
            "string.empty": "Storage attribute id cannot be empty.",
            "any.required":
              "Storage attribute id is required and cannot be null.",
          }),
          colorAttributeId: Joi.string().trim().uuid().required().messages({
            "string.base": "Color attribute id must be a string.",
            "string.empty": "Color attribute id cannot be empty.",
            "any.required":
              "Color attribute id is required and cannot be null.",
          }),
        })
      ),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }
  public validateCreateAccessory(data: IProduct) {
    const schema = Joi.object({
      brandId: Joi.string().trim().uuid().required().messages({
        "string.base": "Brand id must be a string.",
        "string.empty": "Brand id cannot be empty.",
        "any.required": "Brand id is required and cannot be null.",
      }),
      quantity: Joi.number().min(0).required(),
      // categoryId: Joi.string().trim().uuid().required().messages({
      //   "string.base": "Category id must be a string.",
      //   "string.empty": "Category id cannot be empty.",
      //   "any.required": "Category id is required and cannot be null.",
      // }),
      categoryType: Joi.string().valid(CategoryType.ACCESSORY).required(),

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

      grantee: Joi.string().trim().required().messages({
        "string.base": "Grantee must be a string.",
        "string.empty": "Grantee cannot be empty.",
        "any.required": "Grantee is required and cannot be null.",
      }),
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
      descriptionAr: Joi.string().trim().max(1000).allow("").messages({
        "string.base": "DescriptionAr must be a string.",
        "string.max": "DescriptionAr cannot exceed 1000 characters.",
      }),
      basePrice: Joi.number().required().messages({
        "number.base": "Base price must be a number.",
        "number.empty": "Base price cannot be empty.",
        "any.required": "Base price is required and cannot be null.",
      }),
      discount: Joi.number().required().messages({
        "number.base": "Discount must be a number.",
        "number.empty": "Discount cannot be empty.",
        "any.required": "Discount is required and cannot be null.",
      }),
      storeId: Joi.string().uuid().required().messages({
        "string.base": "storeId must be a string.",
        "string.empty": "storeId cannot be empty.",
        "any.required": "storeId is required and cannot be null.",
      }),
      images: Joi.array().items(
        Joi.string()
          .trim()
          .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
          .messages({
            "string.base": "Image must be a string.",
            "string.empty": "Image cannot be empty.",
            "string.pattern.base":
              "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
            "any.required": "Image is required and cannot be null.",
          })
          .required()
      ),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }
  public validateUpdate(data: IProduct) {
    const schema = Joi.object({
      id: Joi.string().uuid().required().messages({
        "string.base": "Id must be a string.",
        "string.empty": "Id cannot be empty.",
        "any.required": "Id is required and cannot be null.",
      }),
      screen: Joi.object({
        id: Joi.string().uuid().required().messages({
          "string.base": "Screen id must be a string.",
          "string.empty": "Screen id cannot be empty.",
          "any.required": "Screen id is required and cannot be null.",
        }),
        size: Joi.string().trim().required().messages({
          "string.base": "Screen size must be a string.",
          "string.empty": "Screen size cannot be empty.",
          "any.required": "Screen size is required and cannot be null.",
        }),
        refreshRate: Joi.string().trim().required().messages({
          "string.base": "Screen refresh rate must be a string.",
          "string.empty": "Screen refresh rate cannot be empty.",
          "any.required": "Screen refresh rate is required and cannot be null.",
        }),
        type: Joi.string().trim().required().messages({
          "string.base": "Screen type must be a string.",
          "string.empty": "Screen type cannot be empty.",
          "any.required": "Screen type is required and cannot be null.",
        }),
        pixelDensity: Joi.string().trim().required().messages({
          "string.base": "Screen pixel density must be a string.",
          "string.empty": "Screen pixel density cannot be empty.",
          "any.required":
            "Screen pixel density is required and cannot be null.",
        }),
        aspectRatio: Joi.string().trim().required().messages({
          "string.base": "Screen aspect ratio must be a string.",
          "string.empty": "Screen aspect ratio cannot be empty.",
          "any.required": "Screen aspect ratio is required and cannot be null.",
        }),
        details: Joi.string().trim().required().messages({
          "string.base": "Screen details must be a string.",
          "string.empty": "Screen details cannot be empty.",
          "any.required": "Screen details is required and cannot be null.",
        }),
      }),
      processorId: Joi.string().trim().uuid().required(),
      // processor: Joi.object({
      //   id: Joi.string().uuid().required().messages({
      //     "string.base": "Processor id must be a string.",
      //     "string.empty": "Processor id cannot be empty.",
      //     "any.required": "Processor id is required and cannot be null.",
      //   }),
      //   type: Joi.string().required().messages({
      //     "string.base": "Processor type must be a string.",
      //     "string.empty": "Processor type cannot be empty.",
      //     "any.required": "Processor type is required and cannot be null.",
      //   }),
      //   noOfCores: Joi.string().required().messages({
      //     "string.base": "Number of cores must be a string.",
      //     "string.empty": "Number of cores cannot be empty.",
      //     "any.required": "Number of cores is required and cannot be null.",
      //   }),
      //   details: Joi.string().required().messages({
      //     "string.base": "Processor details must be a string.",
      //     "string.empty": "Processor details cannot be empty.",
      //     "any.required": "Processor details is required and cannot be null.",
      //   }),
      // }),
      brandId: Joi.string().trim().uuid().required().messages({
        "string.base": "Brand id must be a string.",
        "string.empty": "Brand id cannot be empty.",
        "any.required": "Brand id is required and cannot be null.",
      }),
      categoryType: Joi.string().valid(CategoryType.LAPTOP).required(),
      // categoryId: Joi.string().trim().uuid().required().messages({
      //   "string.base": "Category id must be a string.",
      //   "string.empty": "Category id cannot be empty.",
      //   "any.required": "Category id is required and cannot be null.",
      // }),
      quantity: Joi.number().min(0).required(),
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
      ram: Joi.number().min(1).max(200).required().messages({
        "number.base": "Ram must be a number.",
        "number.empty": "Ram cannot be empty.",
        "number.min": "Ram cannot be less than 1.",
        "number.max": "Ram cannot exceed 200.",
        "any.required": "Ram is required and cannot be null.",
      }),
      battery: Joi.number().min(300).max(500000).required().messages({
        "number.base": "Battery must be a number.",
        "number.empty": "Battery cannot be empty.",
        "number.min": "Battery cannot be less than 300.",
        "number.max": "Battery cannot exceed 5000.",
        "any.required": "Battery is required and cannot be null.",
      }),
      grantee: Joi.string().trim().required().messages({
        "string.base": "Grantee must be a string.",
        "string.empty": "Grantee cannot be empty.",
        "any.required": "Grantee is required and cannot be null.",
      }),
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
      descriptionAr: Joi.string().trim().max(1000).allow("").messages({
        "string.base": "DescriptionAr must be a string.",
        "string.max": "DescriptionAr cannot exceed 1000 characters.",
      }),
      basePrice: Joi.number().required().messages({
        "number.base": "Base price must be a number.",
        "number.empty": "Base price cannot be empty.",
        "any.required": "Base price is required and cannot be null.",
      }),
      discount: Joi.number().required().messages({
        "number.base": "Discount must be a number.",
        "number.empty": "Discount cannot be empty.",
        "any.required": "Discount is required and cannot be null.",
      }),
      // storeId: Joi.string().uuid().required().messages({
      //   "string.base": "storeId must be a string.",
      //   "string.empty": "storeId cannot be empty.",
      //   "any.required": "storeId is required and cannot be null.",
      // }),
      images: Joi.array().items(
        Joi.string()
          .trim()
          .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
          .messages({
            "string.base": "Image must be a string.",
            "string.empty": "Image cannot be empty.",
            "string.pattern.base":
              "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
            "any.required": "Image is required and cannot be null.",
          })
          .required()
      ),
      skus: Joi.array().items(
        Joi.object({
          sku: Joi.string().trim().required().messages({
            "string.base": "Sku must be a string.",
            "string.empty": "Sku cannot be empty.",
            "any.required": "Sku is required and cannot be null.",
          }),
          quantity: Joi.number().required().messages({
            "number.base": "Quantity must be a number.",
            "number.empty": "Quantity cannot be empty.",
            "any.required": "Quantity is required and cannot be null.",
          }),
          price: Joi.number().required().messages({
            "number.base": "Price must be a number.",
            "number.empty": "Price cannot be empty.",
            "any.required": "Price is required and cannot be null.",
          }),
          storageAttributeId: Joi.string().trim().uuid().required().messages({
            "string.base": "Storage attribute id must be a string.",
            "string.empty": "Storage attribute id cannot be empty.",
            "any.required":
              "Storage attribute id is required and cannot be null.",
          }),
          colorAttributeId: Joi.string().trim().uuid().required().messages({
            "string.base": "Color attribute id must be a string.",
            "string.empty": "Color attribute id cannot be empty.",
            "any.required":
              "Color attribute id is required and cannot be null.",
          }),
        })
      ),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateUpdateAccessory(data: IProduct) {
    const schema = Joi.object({
      id: Joi.string().uuid().required().messages({
        "string.base": "Id must be a string.",
        "string.empty": "Id cannot be empty.",
        "any.required": "Id is required and cannot be null.",
      }),

      // processor: Joi.object({
      //   id: Joi.string().uuid().required().messages({
      //     "string.base": "Processor id must be a string.",
      //     "string.empty": "Processor id cannot be empty.",
      //     "any.required": "Processor id is required and cannot be null.",
      //   }),
      //   type: Joi.string().required().messages({
      //     "string.base": "Processor type must be a string.",
      //     "string.empty": "Processor type cannot be empty.",
      //     "any.required": "Processor type is required and cannot be null.",
      //   }),
      //   noOfCores: Joi.string().required().messages({
      //     "string.base": "Number of cores must be a string.",
      //     "string.empty": "Number of cores cannot be empty.",
      //     "any.required": "Number of cores is required and cannot be null.",
      //   }),
      //   details: Joi.string().required().messages({
      //     "string.base": "Processor details must be a string.",
      //     "string.empty": "Processor details cannot be empty.",
      //     "any.required": "Processor details is required and cannot be null.",
      //   }),
      // }),
      brandId: Joi.string().trim().uuid().required().messages({
        "string.base": "Brand id must be a string.",
        "string.empty": "Brand id cannot be empty.",
        "any.required": "Brand id is required and cannot be null.",
      }),
      categoryType: Joi.string().valid(CategoryType.ACCESSORY).required(),
      // categoryId: Joi.string().trim().uuid().required().messages({
      //   "string.base": "Category id must be a string.",
      //   "string.empty": "Category id cannot be empty.",
      //   "any.required": "Category id is required and cannot be null.",
      // }),

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

      grantee: Joi.string().trim().required().messages({
        "string.base": "Grantee must be a string.",
        "string.empty": "Grantee cannot be empty.",
        "any.required": "Grantee is required and cannot be null.",
      }),
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
      descriptionAr: Joi.string().trim().max(1000).allow("").messages({
        "string.base": "DescriptionAr must be a string.",
        "string.max": "DescriptionAr cannot exceed 1000 characters.",
      }),
      basePrice: Joi.number().required().messages({
        "number.base": "Base price must be a number.",
        "number.empty": "Base price cannot be empty.",
        "any.required": "Base price is required and cannot be null.",
      }),
      discount: Joi.number().min(0).required().messages({
        "number.base": "Discount must be a number.",
        "number.empty": "Discount cannot be empty.",
        "any.required": "Discount is required and cannot be null.",
      }),
      // storeId: Joi.string().uuid().required().messages({
      //   "string.base": "storeId must be a string.",
      //   "string.empty": "storeId cannot be empty.",
      //   "any.required": "storeId is required and cannot be null.",
      // }),
      images: Joi.array().items(
        Joi.string()
          .trim()
          .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
          .messages({
            "string.base": "Image must be a string.",
            "string.empty": "Image cannot be empty.",
            "string.pattern.base":
              "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
            "any.required": "Image is required and cannot be null.",
          })
          .required()
      ),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateGetAllStoresQuery(query: {
    search?: any;
    battery?: any;
    ram?: any;
    minPrice?: any;
    maxPrice?: any;
  }) {
    const schema = Joi.object({
      search: Joi.string().trim().max(255).allow("").messages({
        "string.base": "Search term must be a string.",
        "string.max": "Search term cannot exceed 255 characters.",
      }),
      battery: Joi.number()
        .min(300)
        .max(5000)
        .messages({
          "number.base": "Battery must be a number.",
        })
        .allow(""),
      ram: Joi.number().min(1).max(200).allow(""),
      categoryType: Joi.string()
        .valid(...Object.values(CategoryType))
        .allow(""),
      minPrice: Joi.number().min(1).allow(""),
      maxPrice: Joi.number().min(1).greater(Joi.ref("minPrice")).allow(""),
    });

    const { error } = schema.validate(query);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateBrandsIds(data: { brandIds: string[] }) {
    const schema = Joi.object({
      brandIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateCatIds(data: { categoryIds: string[] }) {
    const schema = Joi.object({
      categoryIds: Joi.array().items(Joi.string().uuid()).min(1).required(),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }
  public async count(options: CountOptions = {}) {
    return this.productRepo.count(options);
  }
}

export default PrdouctService;
