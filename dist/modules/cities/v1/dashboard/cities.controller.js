"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CityController = void 0;
const sequelize_1 = require("sequelize");
const appError_1 = require("../../../../utils/appError");
const cities_service_1 = __importDefault(require("./cities.service"));
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const config_1 = __importDefault(require("../../../../config/db/config"));
const generalFunctions_1 = require("../../../../utils/generalFunctions");
const regions_model_1 = __importDefault(require("../../../../models/regions.model"));
class CityController {
    constructor() {
        this.service = cities_service_1.default.getInstance();
    }
    static getInstance() {
        if (!CityController.instance) {
            CityController.instance = new CityController();
        }
        return CityController.instance;
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
        const foundOneWithSameNameAr = await this.service.findOne({
            where: { nameAr: storeData.nameAr },
        });
        if (foundOneWithSameNameAr) {
            throw new appError_1.AppError("entityWithNameExist", 409);
        }
        // Create the city
        const city = await this.service.create(storeData);
        return city;
    }
    async update(req) {
        const { id } = req.params;
        const updateData = req.body;
        // Validate the update data
        this.service.validateUpdate(updateData);
        if (updateData.name) {
            const foundOneWithSameName = await this.service.findOne({
                where: { name: updateData.name, id: { [sequelize_1.Op.ne]: id } },
            });
            if (foundOneWithSameName) {
                throw new appError_1.AppError("entityWithNameExist", 409);
            }
        }
        if (updateData.nameAr) {
            const foundOneWithSameName = await this.service.findOne({
                where: { nameAr: updateData.nameAr, id: { [sequelize_1.Op.ne]: id } },
            });
            if (foundOneWithSameName) {
                throw new appError_1.AppError("entityWithNameExist", 409);
            }
        }
        // Find the city first
        const city = await this.service.findOneByIdOrThrowError(id);
        // Update the city
        const updatedCat = await city.update(updateData);
        return updatedCat;
    }
    async delete(req) {
        const { id } = req.params;
        (0, generalFunctions_1.validateUUID)(id, "invalid city id");
        const city = (await this.service.findOneByIdOrThrowError(id, {
            include: [{ model: regions_model_1.default, attributes: ["id", "name"] }],
        })).toJSON();
        if (city.regions && city.regions.length > 0) {
            throw new appError_1.AppError("cityHasRegions", 403);
        }
        // Delete the city
        return this.service.delete(id);
    }
    async getStore(req) {
        const { id } = req.params;
        const city = await this.service.findOneByIdOrThrowError(id, {
            attributes: ["id", "name", "nameAr"],
        });
        return city;
    }
    async getAllStores(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search, lng } = req.query;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        this.service.validateGetAllStoresQuery({ search });
        const options = {
            attributes: ["id", [config_1.default.col(`cities."${nameColumn}"`), "name"]],
            offset,
            limit,
            order: [[orderBy, order]],
            where: {},
        };
        if (search) {
            search = search.toString().replace(/\+/g, "").trim();
            options.where = config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`cities."${nameColumn}"`)), {
                [sequelize_1.Op.like]: `%${search.toLowerCase()}%`,
            });
        }
        const date = await this.service.getAll(options);
        return date;
    }
}
exports.CityController = CityController;
CityController.instance = null;
