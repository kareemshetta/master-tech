"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const sequelize_1 = require("sequelize");
const appError_1 = require("../../../../utils/appError");
const products_service_1 = __importDefault(require("./products.service"));
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const config_1 = __importDefault(require("../../../../config/db/config"));
const brands_service_1 = __importDefault(require("../../../brands/v1/dashboard/brands.service"));
const categories_service_1 = __importDefault(require("../../../categories/v1/dashboard/categories.service"));
const generalFunctions_1 = require("../../../../utils/generalFunctions");
const stores_service_1 = __importDefault(require("../../../stores/v1/dashboard/stores.service"));
const brands_model_1 = __importDefault(require("../../../../models/brands.model"));
const stores_model_1 = __importDefault(require("../../../../models/stores.model"));
const categories_model_1 = __importDefault(require("../../../../models/categories.model"));
const product_skus_model_1 = require("../../../../models/product_skus.model");
const product_attributes_model_1 = __importDefault(require("../../../../models/product_attributes.model"));
const screen_model_1 = __importDefault(require("../../../../models/screen.model"));
const processor_model_1 = __importDefault(require("../../../../models/processor.model"));
class ProductController {
    constructor() {
        this.service = products_service_1.default.getInstance();
        this.brandService = brands_service_1.default.getInstance();
        this.CategoreyService = categories_service_1.default.getInstance();
        this.storeService = stores_service_1.default.getInstance();
    }
    static getInstance() {
        if (!ProductController.instance) {
            ProductController.instance = new ProductController();
        }
        return ProductController.instance;
    }
    async create(req) {
        const storeData = req.body;
        // Validate the incoming data
        this.service.validateCreate(storeData);
        const foundOneWithSameName = await this.service.findOne({
            where: { name: storeData.name },
        });
        if (foundOneWithSameName) {
            throw new appError_1.AppError("entityWithNameExist", 409);
        }
        await this.brandService.findOneByIdOrThrowError(storeData.brandId);
        await this.CategoreyService.findOneByIdOrThrowError(storeData.categoryId);
        await this.storeService.findOneByIdOrThrowError(storeData.storeId);
        const colorsAttributesIDs = storeData.skus.map((attr) => attr.colorAttributeId);
        const storageAttributesIDs = storeData.skus.map((attr) => attr.storageAttributeId);
        const ids = [...colorsAttributesIDs, ...storageAttributesIDs];
        const attr = (await this.service.attributesRepo.findAll({
            where: {
                id: { [sequelize_1.Op.in]: ids },
            },
            attributes: ["id"],
        }));
        if (!attr.length) {
            throw new appError_1.AppError("attNotFound", 404);
        }
        const attIds = attr.map((attr) => attr.id);
        if (!(0, generalFunctions_1.checkArraysWithSet)(ids, attIds)) {
            throw new appError_1.AppError("attNotFoundWithReplacer", 404, (0, generalFunctions_1.getNotIncludedIds)(ids, attIds).join(", "));
        }
        // Create the product
        const product = await this.service.create(storeData);
        return product;
    }
    async update(req) {
        const { id } = req.params;
        const updateData = req.body;
        // Validate the update data
        updateData.id = id;
        this.service.validateUpdate(updateData);
        // Find the product first
        const product = await this.service.findOneByIdOrThrowError(id);
        if (updateData.name) {
            const foundOneWithSameName = await this.service.findOne({
                where: { name: updateData.name, id: { [sequelize_1.Op.ne]: id } },
            });
            if (foundOneWithSameName) {
                throw new appError_1.AppError("entityWithNameExist", 409);
            }
        }
        if (updateData.brandId)
            await this.brandService.findOneByIdOrThrowError(updateData.brandId);
        if (updateData.categoryId)
            await this.CategoreyService.findOneByIdOrThrowError(updateData.categoryId);
        if (updateData.storeId)
            await this.storeService.findOneByIdOrThrowError(updateData.storeId);
        if (updateData.skus && updateData) {
            const colorsAttributesIDs = updateData.skus.map((attr) => attr.colorAttributeId);
            const storageAttributesIDs = updateData.skus.map((attr) => attr.storageAttributeId);
            const ids = [...colorsAttributesIDs, ...storageAttributesIDs];
            const attr = (await this.service.attributesRepo.findAll({
                where: {
                    id: { [sequelize_1.Op.in]: ids },
                },
                attributes: ["id"],
            }));
            if (!attr.length) {
                throw new appError_1.AppError("attNotFound", 404);
            }
            const attIds = attr.map((attr) => attr.id);
            if (!(0, generalFunctions_1.checkArraysWithSet)(ids, attIds)) {
                throw new appError_1.AppError("attNotFoundWithReplacer", 404, (0, generalFunctions_1.getNotIncludedIds)(ids, attIds).join(", "));
            }
        }
        const updated = await this.service.update(updateData);
        return updated;
    }
    async delete(req) {
        const { id } = req.params;
        (0, generalFunctions_1.validateUUID)(id, "invalid trainer id");
        await this.service.findOneByIdOrThrowError(id);
        // Delete the product
        // Delete the product
        return this.service.delete(id);
    }
    async get(req) {
        const { id } = req.params;
        const product = await this.service.findOneByIdOrThrowError(id, {
            attributes: [
                "id",
                "name",
                "description",
                "basePrice",
                "discount",
                [
                    config_1.default.literal('ROUND(CAST("basePrice" AS DECIMAL) * (1 - (CAST("discount" AS DECIMAL) / 100)), 2)'),
                    "priceAfterDiscount",
                ],
                "brandId",
                "categoryId",
                "storeId",
                "screenId",
                "processorId",
            ],
            include: [
                {
                    model: screen_model_1.default,
                    attributes: [
                        "id",
                        "size",
                        "refreshRate",
                        "pixelDensity",
                        "type",
                        "details",
                    ],
                },
                {
                    model: processor_model_1.default,
                    attributes: ["id", "type", "noOfCores", "details"],
                },
                {
                    model: product_skus_model_1.ProductSku,
                    attributes: [
                        "id",
                        "sku",
                        "price",
                        "quantity",
                        [
                            config_1.default.literal('ROUND(CAST("price" AS DECIMAL) * (1 - (CAST("Product"."discount" AS DECIMAL) / 100)), 2)'),
                            "priceAfterDiscount",
                        ],
                    ],
                    as: "skus",
                    include: [
                        {
                            model: product_attributes_model_1.default,
                            attributes: ["id", "type", "value"],
                            as: "color",
                        },
                        {
                            model: product_attributes_model_1.default,
                            attributes: ["id", "type", "value"],
                            as: "storage",
                        },
                    ],
                },
                { model: brands_model_1.default, attributes: ["name"] },
                { model: categories_model_1.default, attributes: ["name"] },
                { model: stores_model_1.default, attributes: ["id", "name", "image"], as: "store" },
            ],
        });
        return product;
    }
    async getAll(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search, maxPrice, minPrice, brandIds, categoryIds, battery, ram } = req.query;
        this.service.validateGetAllStoresQuery({
            search,
            maxPrice,
            minPrice,
            battery,
            ram,
        });
        const options = {
            attributes: [
                "id",
                "name",
                "basePrice",
                "battery",
                "ram",
                "description",
                "image",
                "discount",
                [
                    config_1.default.literal('ROUND(CAST("basePrice" AS DECIMAL) * (1 - (CAST("discount" AS DECIMAL) / 100)), 2)'),
                    "priceAfterDiscount",
                ],
            ],
            offset,
            limit,
            order: [[orderBy, order]],
            where: {},
            include: [
                { model: stores_model_1.default, attributes: ["id", "name", "image"], as: "store" },
                { model: categories_model_1.default, attributes: ["name"] },
            ],
        };
        if (maxPrice && minPrice) {
            options.where.basePrice = {
                [sequelize_1.Op.between]: [Number(minPrice), Number(maxPrice)],
            };
        }
        if (battery) {
            options.where.battery = { [sequelize_1.Op.gte]: Number(battery) };
        }
        if (ram) {
            options.where.ram = Number(ram);
        }
        if (brandIds) {
            brandIds = brandIds.toString();
            this.service.validateBrandsIds({ brandIds: brandIds.split(",") });
            options.where.brandId = { [sequelize_1.Op.in]: brandIds.split(",") };
        }
        if (search) {
            search = search.toString().replace(/\+/g, "").trim();
            options.where.name = {
                [sequelize_1.Op.or]: [
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col("products.name")), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`products."description"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                ],
            };
        }
        const date = await this.service.getAll(options);
        return date;
    }
}
exports.ProductController = ProductController;
ProductController.instance = null;
