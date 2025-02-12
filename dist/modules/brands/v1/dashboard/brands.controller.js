"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandController = void 0;
const sequelize_1 = require("sequelize");
const appError_1 = require("../../../../utils/appError");
const brands_service_1 = __importDefault(require("./brands.service"));
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const config_1 = __importDefault(require("../../../../config/db/config"));
class BrandController {
    constructor() {
        this.service = brands_service_1.default.getInstance();
    }
    static getInstance() {
        if (!BrandController.instance) {
            BrandController.instance = new BrandController();
        }
        return BrandController.instance;
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
            where: { name: storeData.nameAr },
        });
        if (foundOneWithSameNameAr) {
            throw new appError_1.AppError("entityWithNameExist", 409);
        }
        // Create the brand
        const brand = await this.service.create(storeData);
        return brand;
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
                where: { name: updateData.nameAr, id: { [sequelize_1.Op.ne]: id } },
            });
            if (foundOneWithSameName) {
                throw new appError_1.AppError("entityWithNameExist", 409);
            }
        }
        // Find the brand first
        const brand = await this.service.findOneByIdOrThrowError(id);
        // Update the brand
        const updated = await brand.update(updateData);
        return updated;
    }
    async delete(req) {
        const { id } = req.params;
        // Delete the brand
        return this.service.delete(id);
    }
    async getStore(req) {
        const { id } = req.params;
        const brand = await this.service.findOneByIdOrThrowError(id, {
            attributes: ["id", "name", "nameAr", "image"],
        });
        return brand;
    }
    async getAllStores(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search } = req.query;
        const lng = req.language;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        this.service.validateGetAllQuery({ search });
        const options = {
            attributes: [
                "id",
                [config_1.default.col(`brands."${nameColumn}"`), "name"],
                "image",
            ],
            offset,
            limit,
            order: [[orderBy, order]],
            where: {},
        };
        if (search) {
            search = search.toString().replace(/\+/g, "").trim();
            options.where.name = {
                [sequelize_1.Op.or]: [
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`brands."${nameColumn}"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                ],
            };
        }
        const date = await this.service.getAll(options);
        return date;
    }
}
exports.BrandController = BrandController;
BrandController.instance = null;
