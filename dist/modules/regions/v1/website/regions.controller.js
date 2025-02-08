"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionController = void 0;
const sequelize_1 = require("sequelize");
const appError_1 = require("../../../../utils/appError");
const regions_service_1 = __importDefault(require("./regions.service"));
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const config_1 = __importDefault(require("../../../../config/db/config"));
const cities_service_1 = __importDefault(require("../../../cities/v1/dashboard/cities.service"));
const generalFunctions_1 = require("../../../../utils/generalFunctions");
const cities_model_1 = __importDefault(require("../../../../models/cities.model"));
class RegionController {
    constructor() {
        this.service = regions_service_1.default.getInstance();
        this.cityService = cities_service_1.default.getInstance();
    }
    static getInstance() {
        if (!RegionController.instance) {
            RegionController.instance = new RegionController();
        }
        return RegionController.instance;
    }
    async create(req) {
        const storeData = req.body;
        // Validate the incoming data
        this.service.validateCreate(storeData);
        await this.cityService.findOneByIdOrThrowError(storeData.cityId);
        const foundOneWithSameName = await this.service.findOne({
            where: { name: storeData.name },
        });
        if (foundOneWithSameName) {
            throw new appError_1.AppError("entityWithNameExist", 409);
        }
        // Create the region
        const region = await this.service.create(storeData);
        return region;
    }
    async update(req) {
        const { id } = req.params;
        const updateData = req.body;
        // Validate the update data
        this.service.validateUpdate(updateData);
        if (updateData.cityId) {
            await this.cityService.findOneByIdOrThrowError(updateData.cityId);
        }
        if (updateData.name) {
            const foundOneWithSameName = await this.service.findOne({
                where: { name: updateData.name, id: { [sequelize_1.Op.ne]: id } },
            });
            if (foundOneWithSameName) {
                throw new appError_1.AppError("entityWithNameExist", 409);
            }
        }
        // Find the region first
        const region = await this.service.findOneByIdOrThrowError(id);
        // Update the region
        const updatedCat = await region.update(updateData);
        return updatedCat;
    }
    async delete(req) {
        const { id } = req.params;
        // Delete the region
        return this.service.delete(id);
    }
    async getOne(req) {
        const { id } = req.params;
        const { lng } = req.query;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        const region = await this.service.findOneByIdOrThrowError(id, {
            attributes: [
                "id",
                [config_1.default.col(`regions."${nameColumn}"`), "name"],
                "cityId",
            ],
            include: [
                {
                    model: cities_model_1.default,
                    attributes: ["id", [config_1.default.col(`"${nameColumn}"`), "name"]],
                },
            ],
        });
        return region;
    }
    async getAllStores(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search, cityId, lng } = req.query;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        this.service.validateGetAllStoresQuery({ search });
        const options = {
            attributes: [
                "id",
                [config_1.default.col(`regions."${nameColumn}"`), "name"],
                "cityId",
            ],
            include: [
                {
                    model: cities_model_1.default,
                    attributes: ["id", [config_1.default.col(`"${nameColumn}"`), "name"]],
                },
            ],
            offset,
            limit,
            order: [[orderBy, order]],
            where: {},
        };
        if (cityId) {
            cityId = cityId.toString();
            (0, generalFunctions_1.validateUUID)(cityId, "invalid city id");
            options.where.cityId = cityId;
        }
        if (search) {
            search = search.toString().replace(/\+/g, "").trim();
            options.where.name = {
                [sequelize_1.Op.or]: [
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`regions."${nameColumn}"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                ],
            };
        }
        const date = await this.service.getAll(options);
        return date;
    }
}
exports.RegionController = RegionController;
RegionController.instance = null;
