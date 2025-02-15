"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrdouctService = void 0;
const product_sku_repository_1 = __importDefault(require("../product.sku.repository"));
const product_screen_repository_1 = __importDefault(require("../product.screen.repository"));
const product_processor_repository_1 = __importDefault(require("../product.processor.repository"));
const products_repository_1 = __importDefault(require("../products.repository"));
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../../../../utils/appError");
const attributes_repository_1 = __importDefault(require("../../../attributes/v1/attributes.repository"));
const config_1 = __importDefault(require("../../../../config/db/config"));
const user_product_favourite_repository_1 = __importDefault(require("../../../users/v1/user_product_favourite.repository"));
class PrdouctService {
    constructor() {
        this.productRepo = products_repository_1.default.getInstance();
        this.screenRepo = product_screen_repository_1.default.getInstance();
        this.attributesRepo = attributes_repository_1.default.getInstance();
        this.processorRepo = product_processor_repository_1.default.getInstance();
        this.skuRepo = product_sku_repository_1.default.getInstance();
        this.favouriteRepo = user_product_favourite_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!PrdouctService.instance) {
            PrdouctService.instance = new PrdouctService();
        }
        return PrdouctService.instance;
    }
    async create(data) {
        let transaction = null;
        try {
            transaction = await config_1.default.transaction();
            const screen = (await this.screenRepo.create(data.screen, { transaction })).toJSON();
            const processor = (await this.processorRepo.create(data.processor, {
                transaction,
            })).toJSON();
            const product = await this.productRepo.create({ ...data, processorId: processor.id, screenId: screen.id }, { transaction });
            const productId = product.getDataValue("id");
            const skus = data.skus.map((sku) => ({
                ...sku,
                productId,
            }));
            await this.skuRepo.bulkCreate(skus, { transaction });
            await transaction.commit();
            return product;
        }
        catch (err) {
            if (transaction)
                await transaction.rollback();
            throw err;
        }
    }
    async update(data) {
        let transaction = null;
        try {
            transaction = await config_1.default.transaction();
            if (data.screen?.id) {
                await this.screenRepo.update(data.screen, {
                    transaction,
                    where: { id: data.screen.id },
                });
            }
            if (data.processor?.id) {
                await this.processorRepo.update(data.processor, {
                    transaction,
                    where: { id: data.processor.id },
                });
            }
            const product = await this.productRepo.update({ ...data }, { transaction, where: { id: data.id }, returning: true });
            if (data.skus && data.skus.length > 0) {
                await this.skuRepo.delete({
                    where: { productId: data.id },
                    transaction,
                    force: true,
                });
                const productId = data.id;
                const skus = data.skus.map((sku) => ({
                    ...sku,
                    productId,
                }));
                await this.skuRepo.bulkCreate(skus, { transaction });
            }
            await transaction.commit();
            return product;
        }
        catch (err) {
            if (transaction)
                await transaction.rollback();
            throw err;
        }
    }
    async delete(id) {
        let transaction = null;
        try {
            transaction = await config_1.default.transaction();
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
        }
        catch (err) {
            if (transaction)
                await transaction.rollback();
            throw err;
        }
    }
    async findOneByIdOrThrowError(id, options = {}) {
        return this.productRepo.findOneByIdOrThrowError(id, options);
    }
    async findOne(options = {}) {
        return this.productRepo.findOne(options);
    }
    async getAll(options = {}) {
        return this.productRepo.findAndCountAll(options);
    }
    async getAllWithoutCount(options = {}) {
        return this.productRepo.findAll(options);
    }
    async count(options = {}) {
        return this.productRepo.count(options);
    }
    async toggleFavourite(data) {
        const { userId, productId } = data;
        const favorite = await this.favouriteRepo.findOne({
            where: { userId, productId },
            paranoid: false, // This will include soft-deleted records
        });
        if (favorite) {
            if (favorite.deletedAt) {
                // If it was soft-deleted, restore it
                await favorite.restore();
                return true;
            }
            else {
                // If it exists and is not deleted, soft-delete it
                await favorite.destroy();
                return false;
            }
        }
        else {
            // If no record exists at all, create a new one
            await this.favouriteRepo.create({ userId, productId });
            return true;
        }
    }
    validateCreate(data) {
        const schema = joi_1.default.object({
            screen: joi_1.default.object({
                size: joi_1.default.string().trim().required().messages({
                    "string.base": "Screen size must be a string.",
                    "string.empty": "Screen size cannot be empty.",
                    "any.required": "Screen size is required and cannot be null.",
                }),
                refreshRate: joi_1.default.string().trim().required().messages({
                    "string.base": "Screen refresh rate must be a string.",
                    "string.empty": "Screen refresh rate cannot be empty.",
                    "any.required": "Screen refresh rate is required and cannot be null.",
                }),
                type: joi_1.default.string().trim().required().messages({
                    "string.base": "Screen type must be a string.",
                    "string.empty": "Screen type cannot be empty.",
                    "any.required": "Screen type is required and cannot be null.",
                }),
                pixelDensity: joi_1.default.string().trim().required().messages({
                    "string.base": "Screen pixel density must be a string.",
                    "string.empty": "Screen pixel density cannot be empty.",
                    "any.required": "Screen pixel density is required and cannot be null.",
                }),
                aspectRatio: joi_1.default.string().trim().required().messages({
                    "string.base": "Screen aspect ratio must be a string.",
                    "string.empty": "Screen aspect ratio cannot be empty.",
                    "any.required": "Screen aspect ratio is required and cannot be null.",
                }),
                details: joi_1.default.string().trim().required().messages({
                    "string.base": "Screen details must be a string.",
                    "string.empty": "Screen details cannot be empty.",
                    "any.required": "Screen details is required and cannot be null.",
                }),
            }),
            processor: joi_1.default.object({
                type: joi_1.default.string().required().messages({
                    "string.base": "Processor type must be a string.",
                    "string.empty": "Processor type cannot be empty.",
                    "any.required": "Processor type is required and cannot be null.",
                }),
                noOfCores: joi_1.default.string().required().messages({
                    "string.base": "Number of cores must be a string.",
                    "string.empty": "Number of cores cannot be empty.",
                    "any.required": "Number of cores is required and cannot be null.",
                }),
                details: joi_1.default.string().required().messages({
                    "string.base": "Processor details must be a string.",
                    "string.empty": "Processor details cannot be empty.",
                    "any.required": "Processor details is required and cannot be null.",
                }),
            }),
            brandId: joi_1.default.string().trim().uuid().required().messages({
                "string.base": "Brand id must be a string.",
                "string.empty": "Brand id cannot be empty.",
                "any.required": "Brand id is required and cannot be null.",
            }),
            categoryId: joi_1.default.string().trim().uuid().required().messages({
                "string.base": "Category id must be a string.",
                "string.empty": "Category id cannot be empty.",
                "any.required": "Category id is required and cannot be null.",
            }),
            image: joi_1.default.string()
                .trim()
                .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
                .messages({
                "string.base": "Image must be a string.",
                "string.empty": "Image cannot be empty.",
                "string.pattern.base": "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
                "any.required": "Image is required and cannot be null.",
            })
                .required(),
            ram: joi_1.default.number().min(1).max(200).required().messages({
                "number.base": "Ram must be a number.",
                "number.empty": "Ram cannot be empty.",
                "number.min": "Ram cannot be less than 1.",
                "number.max": "Ram cannot exceed 200.",
                "any.required": "Ram is required and cannot be null.",
            }),
            battery: joi_1.default.number().min(300).max(500000).required().messages({
                "number.base": "Battery must be a number.",
                "number.empty": "Battery cannot be empty.",
                "number.min": "Battery cannot be less than 300.",
                "number.max": "Battery cannot exceed 5000.",
                "any.required": "Battery is required and cannot be null.",
            }),
            name: joi_1.default.string().trim().max(255).required().messages({
                "string.base": "name must be a string.",
                "string.empty": "name cannot be empty.",
                "string.max": "name cannot exceed 255 characters.",
                "any.required": "name is required and cannot be null.",
            }),
            nameAr: joi_1.default.string().trim().max(255).required().messages({
                "string.base": "nameAr must be a string.",
                "string.empty": "nameAr cannot be empty.",
                "string.max": "nameAr cannot exceed 255 characters.",
                "any.required": "nameAr is required and cannot be null.",
            }),
            description: joi_1.default.string().trim().max(1000).allow("").messages({
                "string.base": "Description must be a string.",
                "string.max": "Description cannot exceed 1000 characters.",
            }),
            descriptionAr: joi_1.default.string().trim().max(1000).allow("").messages({
                "string.base": "DescriptionAr must be a string.",
                "string.max": "DescriptionAr cannot exceed 1000 characters.",
            }),
            basePrice: joi_1.default.number().required().messages({
                "number.base": "Base price must be a number.",
                "number.empty": "Base price cannot be empty.",
                "any.required": "Base price is required and cannot be null.",
            }),
            discount: joi_1.default.number().required().messages({
                "number.base": "Discount must be a number.",
                "number.empty": "Discount cannot be empty.",
                "any.required": "Discount is required and cannot be null.",
            }),
            storeId: joi_1.default.string().uuid().required().messages({
                "string.base": "storeId must be a string.",
                "string.empty": "storeId cannot be empty.",
                "any.required": "storeId is required and cannot be null.",
            }),
            images: joi_1.default.array().items(joi_1.default.string()
                .trim()
                .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
                .messages({
                "string.base": "Image must be a string.",
                "string.empty": "Image cannot be empty.",
                "string.pattern.base": "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
                "any.required": "Image is required and cannot be null.",
            })
                .required()),
            skus: joi_1.default.array().items(joi_1.default.object({
                sku: joi_1.default.string().trim().required().messages({
                    "string.base": "Sku must be a string.",
                    "string.empty": "Sku cannot be empty.",
                    "any.required": "Sku is required and cannot be null.",
                }),
                quantity: joi_1.default.number().required().messages({
                    "number.base": "Quantity must be a number.",
                    "number.empty": "Quantity cannot be empty.",
                    "any.required": "Quantity is required and cannot be null.",
                }),
                price: joi_1.default.number().required().messages({
                    "number.base": "Price must be a number.",
                    "number.empty": "Price cannot be empty.",
                    "any.required": "Price is required and cannot be null.",
                }),
                storageAttributeId: joi_1.default.string().trim().uuid().required().messages({
                    "string.base": "Storage attribute id must be a string.",
                    "string.empty": "Storage attribute id cannot be empty.",
                    "any.required": "Storage attribute id is required and cannot be null.",
                }),
                colorAttributeId: joi_1.default.string().trim().uuid().required().messages({
                    "string.base": "Color attribute id must be a string.",
                    "string.empty": "Color attribute id cannot be empty.",
                    "any.required": "Color attribute id is required and cannot be null.",
                }),
            })),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateUpdate(data) {
        const schema = joi_1.default.object({
            id: joi_1.default.string().uuid().required().messages({
                "string.base": "Id must be a string.",
                "string.empty": "Id cannot be empty.",
                "any.required": "Id is required and cannot be null.",
            }),
            screen: joi_1.default.object({
                id: joi_1.default.string().uuid().required().messages({
                    "string.base": "Screen id must be a string.",
                    "string.empty": "Screen id cannot be empty.",
                    "any.required": "Screen id is required and cannot be null.",
                }),
                size: joi_1.default.string().trim().required().messages({
                    "string.base": "Screen size must be a string.",
                    "string.empty": "Screen size cannot be empty.",
                    "any.required": "Screen size is required and cannot be null.",
                }),
                refreshRate: joi_1.default.string().trim().required().messages({
                    "string.base": "Screen refresh rate must be a string.",
                    "string.empty": "Screen refresh rate cannot be empty.",
                    "any.required": "Screen refresh rate is required and cannot be null.",
                }),
                type: joi_1.default.string().trim().required().messages({
                    "string.base": "Screen type must be a string.",
                    "string.empty": "Screen type cannot be empty.",
                    "any.required": "Screen type is required and cannot be null.",
                }),
                pixelDensity: joi_1.default.string().trim().required().messages({
                    "string.base": "Screen pixel density must be a string.",
                    "string.empty": "Screen pixel density cannot be empty.",
                    "any.required": "Screen pixel density is required and cannot be null.",
                }),
                aspectRatio: joi_1.default.string().trim().required().messages({
                    "string.base": "Screen aspect ratio must be a string.",
                    "string.empty": "Screen aspect ratio cannot be empty.",
                    "any.required": "Screen aspect ratio is required and cannot be null.",
                }),
                details: joi_1.default.string().trim().required().messages({
                    "string.base": "Screen details must be a string.",
                    "string.empty": "Screen details cannot be empty.",
                    "any.required": "Screen details is required and cannot be null.",
                }),
            }),
            processor: joi_1.default.object({
                id: joi_1.default.string().uuid().required().messages({
                    "string.base": "Processor id must be a string.",
                    "string.empty": "Processor id cannot be empty.",
                    "any.required": "Processor id is required and cannot be null.",
                }),
                type: joi_1.default.string().required().messages({
                    "string.base": "Processor type must be a string.",
                    "string.empty": "Processor type cannot be empty.",
                    "any.required": "Processor type is required and cannot be null.",
                }),
                noOfCores: joi_1.default.string().required().messages({
                    "string.base": "Number of cores must be a string.",
                    "string.empty": "Number of cores cannot be empty.",
                    "any.required": "Number of cores is required and cannot be null.",
                }),
                details: joi_1.default.string().required().messages({
                    "string.base": "Processor details must be a string.",
                    "string.empty": "Processor details cannot be empty.",
                    "any.required": "Processor details is required and cannot be null.",
                }),
            }),
            brandId: joi_1.default.string().trim().uuid().required().messages({
                "string.base": "Brand id must be a string.",
                "string.empty": "Brand id cannot be empty.",
                "any.required": "Brand id is required and cannot be null.",
            }),
            categoryId: joi_1.default.string().trim().uuid().required().messages({
                "string.base": "Category id must be a string.",
                "string.empty": "Category id cannot be empty.",
                "any.required": "Category id is required and cannot be null.",
            }),
            image: joi_1.default.string()
                .trim()
                .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
                .messages({
                "string.base": "Image must be a string.",
                "string.empty": "Image cannot be empty.",
                "string.pattern.base": "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
                "any.required": "Image is required and cannot be null.",
            })
                .required(),
            ram: joi_1.default.number().min(1).max(200).required().messages({
                "number.base": "Ram must be a number.",
                "number.empty": "Ram cannot be empty.",
                "number.min": "Ram cannot be less than 1.",
                "number.max": "Ram cannot exceed 200.",
                "any.required": "Ram is required and cannot be null.",
            }),
            battery: joi_1.default.number().min(300).max(500000).required().messages({
                "number.base": "Battery must be a number.",
                "number.empty": "Battery cannot be empty.",
                "number.min": "Battery cannot be less than 300.",
                "number.max": "Battery cannot exceed 5000.",
                "any.required": "Battery is required and cannot be null.",
            }),
            name: joi_1.default.string().trim().max(255).required().messages({
                "string.base": "name must be a string.",
                "string.empty": "name cannot be empty.",
                "string.max": "name cannot exceed 255 characters.",
                "any.required": "name is required and cannot be null.",
            }),
            nameAr: joi_1.default.string().trim().max(255).required().messages({
                "string.base": "nameAr must be a string.",
                "string.empty": "nameAr cannot be empty.",
                "string.max": "nameAr cannot exceed 255 characters.",
                "any.required": "nameAr is required and cannot be null.",
            }),
            description: joi_1.default.string().trim().max(1000).allow("").messages({
                "string.base": "Description must be a string.",
                "string.max": "Description cannot exceed 1000 characters.",
            }),
            descriptionAr: joi_1.default.string().trim().max(1000).allow("").messages({
                "string.base": "DescriptionAr must be a string.",
                "string.max": "DescriptionAr cannot exceed 1000 characters.",
            }),
            basePrice: joi_1.default.number().required().messages({
                "number.base": "Base price must be a number.",
                "number.empty": "Base price cannot be empty.",
                "any.required": "Base price is required and cannot be null.",
            }),
            discount: joi_1.default.number().required().messages({
                "number.base": "Discount must be a number.",
                "number.empty": "Discount cannot be empty.",
                "any.required": "Discount is required and cannot be null.",
            }),
            // storeId: Joi.string().uuid().required().messages({
            //   "string.base": "storeId must be a string.",
            //   "string.empty": "storeId cannot be empty.",
            //   "any.required": "storeId is required and cannot be null.",
            // }),
            images: joi_1.default.array().items(joi_1.default.string()
                .trim()
                .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
                .messages({
                "string.base": "Image must be a string.",
                "string.empty": "Image cannot be empty.",
                "string.pattern.base": "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
                "any.required": "Image is required and cannot be null.",
            })
                .required()),
            skus: joi_1.default.array().items(joi_1.default.object({
                sku: joi_1.default.string().trim().required().messages({
                    "string.base": "Sku must be a string.",
                    "string.empty": "Sku cannot be empty.",
                    "any.required": "Sku is required and cannot be null.",
                }),
                quantity: joi_1.default.number().required().messages({
                    "number.base": "Quantity must be a number.",
                    "number.empty": "Quantity cannot be empty.",
                    "any.required": "Quantity is required and cannot be null.",
                }),
                price: joi_1.default.number().required().messages({
                    "number.base": "Price must be a number.",
                    "number.empty": "Price cannot be empty.",
                    "any.required": "Price is required and cannot be null.",
                }),
                storageAttributeId: joi_1.default.string().trim().uuid().required().messages({
                    "string.base": "Storage attribute id must be a string.",
                    "string.empty": "Storage attribute id cannot be empty.",
                    "any.required": "Storage attribute id is required and cannot be null.",
                }),
                colorAttributeId: joi_1.default.string().trim().uuid().required().messages({
                    "string.base": "Color attribute id must be a string.",
                    "string.empty": "Color attribute id cannot be empty.",
                    "any.required": "Color attribute id is required and cannot be null.",
                }),
            })),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateGetAllStoresQuery(query) {
        const schema = joi_1.default.object({
            search: joi_1.default.string().trim().max(255).allow("").messages({
                "string.base": "Search term must be a string.",
                "string.max": "Search term cannot exceed 255 characters.",
            }),
            battery: joi_1.default.number()
                .min(300)
                .max(5000)
                .messages({
                "number.base": "Battery must be a number.",
            })
                .allow(""),
            ram: joi_1.default.number().min(1).max(200).allow(""),
            minPrice: joi_1.default.number().min(1).allow(""),
            maxPrice: joi_1.default.number().min(1).greater(joi_1.default.ref("minPrice")).allow(""),
        });
        const { error } = schema.validate(query);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateComapareQuery(query) {
        const schema = joi_1.default.object({
            fProduct: joi_1.default.string().trim().max(255).allow("").messages({
                "string.base": "Search term must be a string.",
                "string.max": "Search term cannot exceed 255 characters.",
            }),
            sProduct: joi_1.default.string().trim().max(255).allow("").messages({
                "string.base": "Search term must be a string.",
                "string.max": "Search term cannot exceed 255 characters.",
            }),
        });
        const { error } = schema.validate(query);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateBrandsIds(data) {
        const schema = joi_1.default.object({
            brandIds: joi_1.default.array().items(joi_1.default.string().uuid()).min(1).required(),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateCatIds(data) {
        const schema = joi_1.default.object({
            categoryIds: joi_1.default.array().items(joi_1.default.string().uuid()).min(1).required(),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
}
exports.PrdouctService = PrdouctService;
PrdouctService.instance = null;
exports.default = PrdouctService;
