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
const review_model_1 = __importDefault(require("../../../../models/review.model"));
const enums_1 = require("../../../../utils/enums");
class ProductController {
    // private favouriteLiteral: string|Literal;
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
        let storeId = req.user?.storeId;
        // Validate the incoming data
        if (storeId && storeData.storeId && storeId !== storeData.storeId) {
            throw new appError_1.AppError("forbiden", 403);
        }
        if (req.user?.role !== "superAdmin")
            storeData.storeId = storeId;
        this.service.validateCreate(storeData);
        // const foundOneWithSameName = await this.service.findOne({
        //   where: { name: storeData.name },
        // });
        // if (foundOneWithSameName) {
        //   throw new AppError("entityWithNameExist", 409);
        // }
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
    getFavouriteLiteral(userId) {
        return [
            config_1.default.literal(`
  CASE 
    WHEN EXISTS (
      SELECT 1
      FROM "userFavorites" AS "Favourite"
      WHERE "Favourite"."productId" = "Product"."id"
      AND "Favourite"."userId" = '${userId}'
      AND "Favourite"."deletedAt" IS NULL  -- Check for paranoid deleted record
    ) THEN true
    ELSE false
  END
`),
            "isFavourite",
        ];
    }
    async update(req) {
        const { id } = req.params;
        const storeId = req.user?.storeId;
        const updateData = req.body;
        // Validate the update data
        updateData.id = id;
        this.service.validateUpdate(updateData);
        // Find the product first
        const product = (await this.service.findOneByIdOrThrowError(id)).toJSON();
        if (req.user?.role !== "superAdmin" && product.storeId !== storeId) {
            throw new appError_1.AppError("forbiden", 403);
        }
        // if (updateData.name) {
        //   const foundOneWithSameName = await this.service.findOne({
        //     where: { name: updateData.name, id: { [Op.ne]: id } },
        //   });
        //   if (foundOneWithSameName) {
        //     throw new AppError("entityWithNameExist", 409);
        //   }
        // }
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
        let storeId = req.user?.storeId;
        (0, generalFunctions_1.validateUUID)(id, "invalid product id");
        const product = (await this.service.findOneByIdOrThrowError(id)).toJSON();
        if (req.user?.role !== "superAdmin" && product.storeId !== storeId) {
            throw new appError_1.AppError("forbiden", 403);
        }
        // Delete the product
        return this.service.delete(id);
    }
    async get(req) {
        const { id } = req.params;
        const lng = req.language;
        const userId = req.user?.id;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
        // Explicitly type the array as FindAttributeOptions
        const arr = [
            "id",
            [config_1.default.literal(`"Product"."${nameColumn}"`), "name"],
            [config_1.default.literal(`"Product"."${descriptionColumn}"`), "description"],
            "basePrice",
            "discount",
            "grantee",
            "images",
            [
                config_1.default.literal('ROUND(CAST("basePrice" AS DECIMAL) * (1 - (CAST("discount" AS DECIMAL) / 100)), 2)'),
                "priceAfterDiscount",
            ],
            [
                config_1.default.literal('CASE WHEN "Product"."quantity" > 0 THEN true ELSE false END'),
                "isAvailable",
            ],
            "quantity",
            "brandId",
            "categoryId",
            "storeId",
            "screenId",
            "processorId",
            "ram",
            "battery",
        ];
        // Add favorite literal conditionally
        if (userId)
            arr.push(this.getFavouriteLiteral(userId));
        const product = await this.service.findOneByIdOrThrowError(id, {
            attributes: arr,
            // logging: console.log,
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
                        "aspectRatio",
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
                        [
                            config_1.default.literal('CASE WHEN "skus"."quantity" > 0 THEN true ELSE false END'),
                            "isAvailable",
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
                    order: [["price", "ASC"]],
                },
                {
                    model: brands_model_1.default,
                    attributes: [[config_1.default.literal(`brand."${nameColumn}"`), "name"]],
                },
                {
                    model: categories_model_1.default,
                    attributes: [[config_1.default.literal(`category."${nameColumn}"`), "name"]],
                },
                {
                    model: stores_model_1.default,
                    attributes: [
                        "id",
                        [config_1.default.literal(`store."${nameColumn}"`), "name"],
                        "image",
                        "allowShipping",
                    ],
                    as: "store",
                },
            ],
        });
        return product;
    }
    async compare(req) {
        const { fProduct, sProduct } = req.query;
        const lng = req.language;
        this.service.validateComapareQuery({ fProduct, sProduct });
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
        // Explicitly type the array as FindAttributeOptions
        const arr = [
            "id",
            [config_1.default.literal(`"Product"."${nameColumn}"`), "name"],
            [config_1.default.literal(`"Product"."${descriptionColumn}"`), "description"],
            "basePrice",
            "discount",
            [
                config_1.default.literal('ROUND(CAST("basePrice" AS DECIMAL) * (1 - (CAST("discount" AS DECIMAL) / 100)), 2)'),
                "priceAfterDiscount",
            ],
            "grantee",
            "brandId",
            "categoryId",
            "storeId",
            "screenId",
            "processorId",
            "ram",
            "battery",
        ];
        const options = {
            attributes: arr,
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
                        "aspectRatio",
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
                        [
                            config_1.default.literal('CASE WHEN "quantity" > 0 THEN true ELSE false END'),
                            "isAvailable",
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
                {
                    model: brands_model_1.default,
                    attributes: [[config_1.default.literal(`brand."${nameColumn}"`), "name"]],
                },
                // {
                //   model: Category,
                //   attributes: [[sequelize.literal(`category."${nameColumn}"`), "name"]],
                // },
                {
                    model: stores_model_1.default,
                    attributes: [
                        "id",
                        [config_1.default.literal(`store."${nameColumn}"`), "name"],
                        "image",
                        "allowShipping",
                    ],
                    as: "store",
                },
            ],
        };
        const [fProd, sProd] = await Promise.all([
            this.service.findOne({
                where: { [`${nameColumn}`]: { [sequelize_1.Op.like]: `%${fProduct}%` } },
                ...options,
            }),
            this.service.findOne({
                where: { [`${nameColumn}`]: { [sequelize_1.Op.like]: `%${sProduct}%` } },
                ...options,
            }),
        ]);
        return { fProd, sProd };
    }
    async getAll(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search, maxPrice, minPrice, brandIds, storeId, 
        // categoryId,
        categoryType, storageId, processorIds, battery, ram, screenSize, isAcc, } = req.query;
        const lng = req.language;
        const userId = req.user?.id;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
        this.service.validateGetAllStoresQuery({
            search,
            maxPrice,
            minPrice,
            battery,
            ram,
            categoryType,
        });
        const options = {
            attributes: [
                "id",
                [config_1.default.literal(`"Product"."${nameColumn}"`), "name"],
                [config_1.default.literal(`"Product"."${descriptionColumn}"`), "description"],
                [
                    config_1.default.fn("ROUND", config_1.default.fn("COALESCE", config_1.default.fn("AVG", config_1.default.col("reviews.rating")), 0), 2),
                    "averageRating",
                ],
                "grantee",
                "basePrice",
                "battery",
                "ram",
                "brandId",
                "storeId",
                "image",
                "discount",
                "categoryType",
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
                {
                    required: !isAcc ? true : false,
                    model: screen_model_1.default,
                    attributes: [],
                    where: {},
                },
                {
                    model: stores_model_1.default,
                    attributes: [
                        "id",
                        [config_1.default.literal(`store."${nameColumn}"`), "name"],
                        // [sequelize.literal(`"${descriptionColumn}"`), "description"],
                        "image",
                    ],
                    as: "store",
                },
                // {
                //   model: Category,
                //   attributes: [
                //     [sequelize.literal(`category."${nameColumn}"`), "name"],
                //     "id",
                //     // [sequelize.literal(`"${descriptionColumn}"`), "description"],
                //   ],
                // },
                { model: review_model_1.default, attributes: [] },
                {
                    required: !isAcc ? true : false,
                    model: product_skus_model_1.ProductSku,
                    attributes: ["id"],
                    as: "skus",
                    include: [
                        {
                            required: !isAcc ? true : false,
                            model: product_attributes_model_1.default,
                            attributes: ["id", "type", "value"],
                            where: {},
                            as: "storage",
                        },
                    ],
                },
            ],
            group: [
                "Product.id",
                "store.id",
                // "category.id",
                "skus.id",
                "skus->storage.id",
            ],
            subQuery: false,
        };
        const countOption = {
            offset,
            limit,
            order: [[orderBy, order]],
            where: {},
            include: [
                {
                    required: !isAcc ? true : false,
                    model: screen_model_1.default,
                    attributes: [],
                    where: {},
                },
                {
                    model: product_skus_model_1.ProductSku,
                    required: !isAcc ? true : false,
                    attributes: [],
                    as: "skus",
                    include: [
                        {
                            required: !isAcc ? true : false,
                            model: product_attributes_model_1.default,
                            attributes: [],
                            where: {},
                            as: "storage",
                        },
                    ],
                },
            ],
        };
        if (storeId) {
            options.where.storeId = storeId;
            countOption.where.storeId = storeId;
        }
        if (categoryType) {
            options.where.categoryType = categoryType;
            countOption.where.categoryType = categoryType;
        }
        if (userId)
            options.attributes.push([
                config_1.default.literal(`
    CASE 
      WHEN EXISTS (
        SELECT 1
        FROM "userFavorites" AS "Favourite"
        WHERE "Favourite"."productId" = "Product"."id"
        AND "Favourite"."userId" = '${userId}'
        AND "Favourite"."deletedAt" IS NULL  -- Check for paranoid deleted record
      ) THEN true
      ELSE false
    END
  `),
                "isFavourite",
            ]);
        if (maxPrice && minPrice) {
            options.where.basePrice = {
                [sequelize_1.Op.between]: [Number(minPrice), Number(maxPrice)],
            };
            countOption.where.basePrice = {
                [sequelize_1.Op.between]: [Number(minPrice), Number(maxPrice)],
            };
        }
        if (battery) {
            options.where.battery = { [sequelize_1.Op.gte]: Number(battery) };
            countOption.where.battery = { [sequelize_1.Op.gte]: Number(battery) };
        }
        if (ram) {
            options.where.ram = Number(ram);
            countOption.where.ram = Number(ram);
        }
        if (brandIds) {
            brandIds = brandIds.toString();
            this.service.validateBrandsIds({ brandIds: brandIds.split(",") });
            options.where.brandId = { [sequelize_1.Op.in]: brandIds.split(",") };
            countOption.where.brandId = { [sequelize_1.Op.in]: brandIds.split(",") };
        }
        if (storageId) {
            options.include[3].include[0].where.id = storageId;
            countOption.include[1].include[0].where.id = storageId;
        }
        if (processorIds) {
            processorIds = processorIds.toString();
            this.service.validateProcessorsIds({
                processorIds: processorIds.split(","),
            });
            options.where.processorId = { [sequelize_1.Op.in]: processorIds.split(",") };
            countOption.where.processorId = { [sequelize_1.Op.in]: processorIds.split(",") };
        }
        if (screenSize && !isAcc && categoryType == enums_1.CategoryType.LAPTOP) {
            options.include[0].where.size = screenSize;
            countOption.include[0].where.size = screenSize;
        }
        if (search) {
            search = search.toString().replace(/\+/g, "").trim();
            const searchOp = {
                [sequelize_1.Op.or]: [
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.literal(`"Product"."${nameColumn}"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.literal(`"Product"."${descriptionColumn}"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                ],
            };
            options.where.name = searchOp;
            countOption.where.name = searchOp;
        }
        const date = await this.service.getAllWithoutCount(options);
        const count = await this.service.count(countOption);
        return { rows: date, count };
    }
    async getAllTopRated(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search, maxPrice, minPrice, brandIds, storeId, categoryId, battery, ram, screenSize, categoryType, } = req.query;
        const lng = req.language;
        const userId = req.user?.id;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
        this.service.validateGetAllStoresQuery({
            search,
            maxPrice,
            minPrice,
            battery,
            ram,
            categoryType,
        });
        const options = {
            attributes: [
                "id",
                [config_1.default.literal(`"Product"."${nameColumn}"`), "name"],
                [config_1.default.literal(`"Product"."${descriptionColumn}"`), "description"],
                [
                    config_1.default.fn("ROUND", config_1.default.fn("COALESCE", config_1.default.fn("AVG", config_1.default.col("reviews.rating")), 0), 2),
                    "averageRating",
                ],
                // [sequelize.fn("COUNT", sequelize.col("reviews.id")), "totalReviews"],
                "basePrice",
                "battery",
                "ram",
                "brandId",
                "storeId",
                "image",
                "discount",
                "grantee",
                "categoryType",
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
                { model: screen_model_1.default, attributes: [], where: {} },
                {
                    model: stores_model_1.default,
                    attributes: [
                        "id",
                        [config_1.default.literal(`store."${nameColumn}"`), "name"],
                        // [sequelize.literal(`"${descriptionColumn}"`), "description"],
                        "image",
                    ],
                    as: "store",
                },
                // {
                //   model: Category,
                //   attributes: [
                //     [sequelize.literal(`category."${nameColumn}"`), "name"],
                //     // [sequelize.literal(`"${descriptionColumn}"`), "description"],
                //   ],
                // },
                { model: review_model_1.default, attributes: [] },
            ],
            group: ["Product.id", "store.id"],
            subQuery: false,
        };
        const countOption = {
            offset,
            limit,
            order: [
                [
                    config_1.default.fn("ROUND", config_1.default.fn("COALESCE", config_1.default.fn("AVG", config_1.default.col("reviews.rating")), 0), 2),
                    "DESC",
                ],
                [config_1.default.fn("COUNT", config_1.default.col("reviews.id")), "DESC"],
            ],
            where: {},
            include: [{ model: screen_model_1.default, attributes: [], where: {} }],
        };
        if (storeId) {
            options.where.storeId = storeId;
            countOption.where.storeId = storeId;
        }
        if (categoryType) {
            options.where.categoryType = categoryType;
            countOption.where.categoryType = categoryType;
        }
        if (userId)
            options.attributes.push([
                config_1.default.literal(`
    CASE 
      WHEN EXISTS (
        SELECT 1
        FROM "userFavorites" AS "Favourite"
        WHERE "Favourite"."productId" = "Product"."id"
        AND "Favourite"."userId" = '${userId}'
        AND "Favourite"."deletedAt" IS NULL  -- Check for paranoid deleted record
      ) THEN true
      ELSE false
    END
  `),
                "isFavourite",
            ]);
        if (maxPrice && minPrice) {
            options.where.basePrice = {
                [sequelize_1.Op.between]: [Number(minPrice), Number(maxPrice)],
            };
            countOption.where.basePrice = {
                [sequelize_1.Op.between]: [Number(minPrice), Number(maxPrice)],
            };
        }
        if (battery) {
            options.where.battery = { [sequelize_1.Op.gte]: Number(battery) };
            countOption.where.battery = { [sequelize_1.Op.gte]: Number(battery) };
        }
        if (ram) {
            options.where.ram = Number(ram);
            countOption.where.ram = Number(ram);
        }
        if (brandIds) {
            brandIds = brandIds.toString();
            this.service.validateBrandsIds({ brandIds: brandIds.split(",") });
            options.where.brandId = { [sequelize_1.Op.in]: brandIds.split(",") };
            countOption.where.brandId = { [sequelize_1.Op.in]: brandIds.split(",") };
        }
        if (search) {
            search = search.toString().replace(/\+/g, "").trim();
            const searchOp = {
                [sequelize_1.Op.or]: [
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.literal(`"Product"."${nameColumn}"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.literal(`"Product"."${descriptionColumn}"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                ],
            };
            options.where.name = searchOp;
            countOption.where.name = searchOp;
        }
        const date = await this.service.getAllWithoutCount(options);
        const count = await this.service.count(countOption);
        return { rows: date, count };
    }
    async toggleFavourite(req) {
        const { productId } = req.params;
        const userId = req.user?.id;
        (0, generalFunctions_1.validateUUID)(productId, "invalid product id");
        (0, generalFunctions_1.validateUUID)(userId, "invalid user id");
        const product = await this.service.findOneByIdOrThrowError(productId);
        const isFavourite = await this.service.toggleFavourite({
            productId,
            userId,
        });
        return isFavourite;
    }
    async getALike(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search, maxPrice, minPrice, categoryType, battery, ram } = req.query;
        const lng = req.language;
        const userId = req.user?.id;
        const { id } = req.params;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
        (0, generalFunctions_1.validateUUID)(id, "invalid product id");
        this.service.validateGetAllStoresQuery({
            search,
            maxPrice,
            minPrice,
            battery,
            ram,
            categoryType,
        });
        const product = (await this.service.findOneByIdOrThrowError(id, {
            attributes: [
                "id",
                "brandId",
                "storeId",
                "categoryType",
                [config_1.default.literal(`"Product"."${nameColumn}"`), "name"],
            ],
        })).toJSON();
        const options = {
            attributes: [
                "id",
                [config_1.default.literal(`"Product"."${nameColumn}"`), "name"],
                [config_1.default.literal(`"Product"."${descriptionColumn}"`), "description"],
                [
                    config_1.default.fn("ROUND", config_1.default.fn("COALESCE", config_1.default.fn("AVG", config_1.default.col("reviews.rating")), 0), 2),
                    "averageRating",
                ],
                "basePrice",
                "battery",
                "ram",
                "brandId",
                "storeId",
                "image",
                "discount",
                "grantee",
                "categoryType",
                [
                    config_1.default.literal('ROUND(CAST("basePrice" AS DECIMAL) * (1 - (CAST("discount" AS DECIMAL) / 100)), 2)'),
                    "priceAfterDiscount",
                ],
            ],
            offset,
            limit,
            order: [[orderBy, order]],
            where: { id: { [sequelize_1.Op.ne]: id } },
            include: [
                {
                    model: stores_model_1.default,
                    attributes: [
                        "id",
                        [config_1.default.literal(`store."${nameColumn}"`), "name"],
                        // [sequelize.literal(`"${descriptionColumn}"`), "description"],
                        "image",
                    ],
                    as: "store",
                },
                // {
                //   model: Category,
                //   attributes: [
                //     [sequelize.literal(`category."${nameColumn}"`), "name"],
                //     // [sequelize.literal(`"${descriptionColumn}"`), "description"],
                //   ],
                // },
                { model: review_model_1.default, attributes: [] },
            ],
            group: ["Product.id", "store.id"],
            subQuery: false,
        };
        const countOption = {
            offset,
            limit,
            order: [[orderBy, order]],
            where: { id: { [sequelize_1.Op.ne]: id } },
        };
        options.where.storeId = product.storeId;
        countOption.where.storeId = product.storeId;
        options.where.categoryType = product.categoryType;
        countOption.where.categoryType = product.categoryType;
        if (userId)
            options.attributes.push([
                config_1.default.literal(`
    CASE 
      WHEN EXISTS (
        SELECT 1
        FROM "userFavorites" AS "Favourite"
        WHERE "Favourite"."productId" = "Product"."id"
        AND "Favourite"."userId" = '${userId}'
        AND "Favourite"."deletedAt" IS NULL  -- Check for paranoid deleted record
      ) THEN true
      ELSE false
    END
  `),
                "isFavourite",
            ]);
        // if (search) {
        //   search = product.name!.toString().replace(/\+/g, "").trim();
        //   const searchOp = {
        //     [Op.or]: [
        //       sequelize.where(
        //         sequelize.fn(
        //           "LOWER",
        //           sequelize.literal(`"Product"."${nameColumn}"`)
        //         ),
        //         "LIKE",
        //         "%" + search.toLowerCase() + "%"
        //       ),
        //       sequelize.where(
        //         sequelize.fn(
        //           "LOWER",
        //           sequelize.literal(`"Product"."${descriptionColumn}"`)
        //         ),
        //         "LIKE",
        //         "%" + search.toLowerCase() + "%"
        //       ),
        //     ],
        //   };
        //   options.where.name = searchOp;
        //   countOption.where.name = searchOp;
        // }
        const date = await this.service.getAllWithoutCount(options);
        const count = await this.service.count(countOption);
        return { rows: date, count };
    }
}
exports.ProductController = ProductController;
ProductController.instance = null;
