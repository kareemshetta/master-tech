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
        const store = await this.storeService.findOneByIdOrThrowError(id, {
            include: [
                {
                    model: stores_model_1.default,
                    attributes: ["id", "name", "phoneNumber"],
                    as: "subStores",
                },
                {
                    model: stores_model_1.default,
                    attributes: ["id", "name", "phoneNumber"],
                    as: "parentStore",
                },
                {
                    model: cities_model_1.default,
                    attributes: ["id", "name"],
                },
                {
                    model: regions_model_1.default,
                    attributes: ["id", "name"],
                },
            ],
        });
        return store;
    }
    async getAllStores(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search, storeIds, cityId, regionId } = req.query;
        this.storeService.validateGetAllStoresQuery({
            search,
            storeIds,
            cityId,
            regionId,
        });
        const options = {
            offset,
            limit,
            order: [[orderBy, order]],
            where: {},
        };
        if (search) {
            search = search.toString().replace(/\+/g, "").trim();
            options.where.name = {
                [sequelize_1.Op.or]: [
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col("stores.name")), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`stores."phoneNumber"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                ],
            };
        }
        if (storeIds) {
            storeIds = storeIds.toString().split(",");
            options.where.parentId = { [sequelize_1.Op.in]: storeIds };
        }
        if (cityId) {
            options.where.cityId = cityId;
        }
        if (regionId) {
            options.where.regionId = regionId;
        }
        const date = await this.storeService.getAll(options);
        return date;
    }
}
exports.StoreController = StoreController;
StoreController.instance = null;
exports.default = StoreController;
