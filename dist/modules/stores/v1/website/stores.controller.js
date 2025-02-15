"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreController = void 0;
const stores_service_1 = require("./../dashboard/stores.service");
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const sequelize_1 = require("sequelize");
const stores_model_1 = __importDefault(require("../../../../models/stores.model"));
const config_1 = __importDefault(require("../../../../config/db/config"));
const cities_model_1 = __importDefault(require("../../../../models/cities.model"));
const regions_model_1 = __importDefault(require("../../../../models/regions.model"));
const products_model_1 = __importDefault(require("../../../../models/products.model"));
const review_model_1 = __importDefault(require("../../../../models/review.model"));
class StoreController {
    constructor() {
        this.storeService = stores_service_1.StoreService.getInstance();
    }
    static getInstance() {
        if (!StoreController.instance) {
            StoreController.instance = new StoreController();
        }
        return StoreController.instance;
    }
    async getStore(req) {
        const { id } = req.params;
        const lng = req.language;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
        const store = await this.storeService.findOneByIdOrThrowError(id, {
            attributes: [
                "id",
                [config_1.default.col(`stores."${nameColumn}"`), "name"],
                [config_1.default.col(`stores."${descriptionColumn}"`), "description"],
                "location",
                "image",
                "phoneNumber",
            ],
            include: [
                {
                    model: stores_model_1.default,
                    attributes: [
                        "id",
                        [config_1.default.col(`${nameColumn}"`), "name"],
                        "phoneNumber",
                    ],
                    as: "subStores",
                },
                {
                    model: stores_model_1.default,
                    attributes: [
                        "id",
                        [config_1.default.col(`${nameColumn}"`), "name"],
                        "phoneNumber",
                    ],
                    as: "parentStore",
                },
                {
                    model: cities_model_1.default,
                    attributes: ["id", [config_1.default.col(`${nameColumn}"`), "name"]],
                },
                {
                    model: regions_model_1.default,
                    attributes: ["id", [config_1.default.col(`${nameColumn}"`), "name"]],
                },
            ],
        });
        return store;
    }
    async getAllStores(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search, storeIds, cityId, regionId } = req.query;
        const lng = req.language;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
        this.storeService.validateGetAllStoresQuery({
            search,
            storeIds,
            cityId,
            regionId,
        });
        const options = {
            attributes: [
                "id",
                [config_1.default.col(`stores."${nameColumn}"`), "name"], // nameAr or name ( depends on the language of the stores. ), "name"],
                [config_1.default.col(`stores."${descriptionColumn}"`), "description"],
                [
                    config_1.default.fn("ROUND", config_1.default.fn("COALESCE", config_1.default.fn("AVG", config_1.default.col("products->reviews.rating")), 0), 2),
                    "averageRating",
                ],
                [
                    config_1.default.fn("COUNT", config_1.default.col("products->reviews.id")),
                    "totalReviews",
                ], // nameAr or name ( depends on the language of the stores. ), "name"],
                "phoneNumber",
                "location",
                "image",
            ],
            offset,
            limit,
            order: [[orderBy, order]],
            include: [
                {
                    model: products_model_1.default,
                    as: "products",
                    attributes: [],
                    required: false,
                    include: [
                        {
                            model: review_model_1.default,
                            as: "reviews",
                            attributes: [],
                            required: false,
                        },
                    ],
                },
                {
                    model: cities_model_1.default,
                    attributes: ["id", [config_1.default.col(`"${nameColumn}"`), "name"]],
                },
                {
                    model: regions_model_1.default,
                    attributes: ["id", [config_1.default.col(`"${nameColumn}"`), "name"]],
                },
            ],
            group: [
                "stores.id",
                `stores.${nameColumn}`,
                `city.${nameColumn}`,
                `region.${nameColumn}`,
                "region.id",
                "city.id",
                // "stores.nameAr",
                // "stores.description",
                `stores.${descriptionColumn}`,
                // "stores.phoneNumber",
                // "stores.location",
                // "stores.image",
            ],
            where: {},
            subQuery: false,
        };
        const countOptions = {
            offset,
            limit,
            order: [[orderBy, order]],
            where: {},
        };
        if (search) {
            search = search.toString().replace(/\+/g, "").trim();
            options.where.name = {
                [sequelize_1.Op.or]: [
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`stores."${nameColumn}"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`stores."${descriptionColumn}"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`stores."phoneNumber"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                ],
            };
            countOptions.where.name = {
                [sequelize_1.Op.or]: [
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`stores."${nameColumn}"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`stores."${descriptionColumn}"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`stores."phoneNumber"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                ],
            };
        }
        if (storeIds) {
            storeIds = storeIds.toString().split(",");
            options.where.parentId = { [sequelize_1.Op.in]: storeIds };
            countOptions.where.parentId = { [sequelize_1.Op.in]: storeIds };
        }
        if (cityId) {
            options.where.cityId = cityId;
            countOptions.where.cityId = cityId;
        }
        if (regionId) {
            options.where.regionId = regionId;
            countOptions.where.regionId = regionId;
        }
        const date = await this.storeService.getAllWithoutCount(options);
        const count = await this.storeService.count(countOptions);
        return { rows: date, count: count };
    }
    async getAllHighRatedStores(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search, storeIds, cityId, regionId } = req.query;
        const lng = req.language;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
        this.storeService.validateGetAllStoresQuery({
            search,
            storeIds,
            cityId,
            regionId,
        });
        const options = {
            // logging: console.log,
            attributes: [
                "id",
                [config_1.default.col(`stores.${nameColumn}`), "name"], // Fix ambiguity by explicitly referencing "stores"
                [config_1.default.col(`stores.${descriptionColumn}`), "description"],
                "phoneNumber",
                "location",
                "image",
                [
                    config_1.default.fn("ROUND", config_1.default.fn("COALESCE", config_1.default.fn("AVG", config_1.default.col("products->reviews.rating")), 0), 2),
                    "averageRating",
                ],
                [
                    config_1.default.fn("COUNT", config_1.default.col("products->reviews.id")),
                    "totalReviews",
                ],
            ],
            include: [
                {
                    model: products_model_1.default,
                    as: "products",
                    attributes: [],
                    required: false,
                    include: [
                        {
                            model: review_model_1.default,
                            as: "reviews",
                            attributes: [],
                            required: false,
                        },
                    ],
                },
            ],
            group: [
                "stores.id",
                `stores.${nameColumn}`,
                // "stores.nameAr",
                // "stores.description",
                `stores.${descriptionColumn}`,
                // "stores.phoneNumber",
                // "stores.location",
                // "stores.image",
            ],
            // having: sequelize.literal('COUNT("products->reviews"."id") > 0'),
            order: [
                [
                    config_1.default.fn("ROUND", config_1.default.fn("COALESCE", config_1.default.fn("AVG", config_1.default.col("products->reviews.rating")), 0), 2),
                    "DESC",
                ],
                [config_1.default.fn("COUNT", config_1.default.col("products->reviews.id")), "DESC"],
            ],
            where: {},
            offset,
            limit,
            subQuery: false,
        };
        const date = await this.storeService.getAllWithoutCount(options);
        return date;
    }
}
exports.StoreController = StoreController;
StoreController.instance = null;
exports.default = StoreController;
