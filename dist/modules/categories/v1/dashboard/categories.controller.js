"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const sequelize_1 = require("sequelize");
const appError_1 = require("../../../../utils/appError");
const categories_service_1 = __importDefault(require("./categories.service"));
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const config_1 = __importDefault(require("../../../../config/db/config"));
class CategoryController {
    constructor() {
        this.catService = categories_service_1.default.getInstance();
    }
    static getInstance() {
        if (!CategoryController.instance) {
            CategoryController.instance = new CategoryController();
        }
        return CategoryController.instance;
    }
    async create(req) {
        const storeData = req.body;
        // Validate the incoming data
        this.catService.validateCreate(storeData);
        const foundOneWithSameName = await this.catService.findOne({
            where: { name: storeData.name },
        });
        if (foundOneWithSameName) {
            throw new appError_1.AppError("entityWithNameExist", 409);
        }
        // Create the cat
        const cat = await this.catService.create(storeData);
        return cat;
    }
    async update(req) {
        const { id } = req.params;
        const updateData = req.body;
        // Validate the update data
        this.catService.validateUpdate(updateData);
        if (updateData.name) {
            const foundOneWithSameName = await this.catService.findOne({
                where: { name: updateData.name, id: { [sequelize_1.Op.ne]: id } },
            });
            if (foundOneWithSameName) {
                throw new appError_1.AppError("entityWithNameExist", 409);
            }
        }
        // Find the cat first
        const cat = await this.catService.findOneByIdOrThrowError(id);
        // Update the cat
        const updatedCat = await cat.update(updateData);
        return updatedCat;
    }
    async delete(req) {
        const { id } = req.params;
        // Delete the cat
        return this.catService.delete(id);
    }
    async getStore(req) {
        const { id } = req.params;
        const cat = await this.catService.findOneByIdOrThrowError(id, {});
        return cat;
    }
    async getAllStores(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search } = req.query;
        this.catService.validateGetAllStoresQuery({ search });
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
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col("categories.name")), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`categories."description"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                ],
            };
        }
        const date = await this.catService.getAll(options);
        return date;
    }
}
exports.CategoryController = CategoryController;
CategoryController.instance = null;
