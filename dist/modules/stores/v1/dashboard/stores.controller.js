"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreController = void 0;
const stores_service_1 = require("./stores.service");
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const appError_1 = require("../../../../utils/appError");
const sequelize_1 = require("sequelize");
const stores_model_1 = __importDefault(require("../../../../models/stores.model"));
const config_1 = __importDefault(require("../../../../config/db/config"));
const admins_model_1 = __importDefault(require("../../../../models/admins.model"));
const cities_service_1 = __importDefault(require("../../../cities/v1/dashboard/cities.service"));
const regions_model_1 = __importDefault(require("../../../../models/regions.model"));
const regions_service_1 = __importDefault(require("../../../regions/v1/dashboard/regions.service"));
const cities_model_1 = __importDefault(require("../../../../models/cities.model"));
class StoreController {
    constructor() {
        this.storeService = stores_service_1.StoreService.getInstance();
        this.cityService = cities_service_1.default.getInstance();
        this.regionService = regions_service_1.default.getInstance();
    }
    static getInstance() {
        if (!StoreController.instance) {
            StoreController.instance = new StoreController();
        }
        return StoreController.instance;
    }
    async createStore(req) {
        const storeData = req.body;
        // Validate the incoming data
        this.storeService.validateCreateStore(storeData);
        storeData.cityId &&
            (await this.cityService.findOneByIdOrThrowError(storeData.cityId));
        storeData.regionId &&
            (await this.regionService.findOneByIdOrThrowError(storeData.regionId));
        const foundOneWithSameName = await this.storeService.findOne({
            where: { name: storeData.name },
        });
        if (foundOneWithSameName) {
            throw new appError_1.AppError("entityWithNameExist", 409);
        }
        const foundOneWithSamePhone = await this.storeService.findOne({
            where: { phoneNumber: storeData.phoneNumber },
        });
        if (foundOneWithSamePhone) {
            throw new appError_1.AppError("entityWithPhoneExist", 409);
        }
        // Create the store
        const store = await this.storeService.create(storeData);
        return store;
    }
    async updateStore(req) {
        const { id } = req.params;
        const updateData = req.body;
        // Validate the update data
        this.storeService.validateUpdateStore(updateData);
        updateData.cityId &&
            (await this.cityService.findOneByIdOrThrowError(updateData.cityId));
        updateData.regionId &&
            (await this.regionService.findOneByIdOrThrowError(updateData.regionId));
        if (updateData.name) {
            const foundOneWithSameName = await this.storeService.findOne({
                where: { name: updateData.name, id: { [sequelize_1.Op.ne]: id } },
            });
            if (foundOneWithSameName) {
                throw new appError_1.AppError("entityWithNameExist", 409);
            }
        }
        if (updateData.phoneNumber) {
            const foundOneWithSamePhone = await this.storeService.findOne({
                where: { phoneNumber: updateData.phoneNumber, id: { [sequelize_1.Op.ne]: id } },
            });
            if (foundOneWithSamePhone) {
                throw new appError_1.AppError("entityWithPhoneExist", 409);
            }
        }
        // Find the store first
        const store = await this.storeService.findOneByIdOrThrowError(id);
        // Update the store
        const updatedStore = await store.update(updateData);
        return updatedStore;
    }
    async deleteStore(req) {
        const { id } = req.params;
        // Delete the store
        return this.storeService.delete(id);
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
                    model: admins_model_1.default,
                    attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
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
