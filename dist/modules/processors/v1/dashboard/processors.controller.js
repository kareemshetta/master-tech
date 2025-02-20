"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessorController = void 0;
const sequelize_1 = require("sequelize");
const appError_1 = require("../../../../utils/appError");
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const config_1 = __importDefault(require("../../../../config/db/config"));
const processors_service_1 = __importDefault(require("./processors.service"));
const products_service_1 = __importDefault(require("../../../products/v1/dashboard/products.service"));
const generalFunctions_1 = require("../../../../utils/generalFunctions");
class ProcessorController {
    constructor() {
        this.service = processors_service_1.default.getInstance();
        this.productService = products_service_1.default.getInstance();
    }
    static getInstance() {
        if (!ProcessorController.instance) {
            ProcessorController.instance = new ProcessorController();
        }
        return ProcessorController.instance;
    }
    async create(req) {
        const storeData = req.body;
        // Validate the incoming data
        this.service.validateCreateOrUpdate(storeData);
        const foundOneWithSameName = await this.service.findOne({
            where: { type: storeData.type },
        });
        if (foundOneWithSameName) {
            throw new appError_1.AppError("entityWithNameExist", 409);
        }
        // Create the brand
        const processor = await this.service.create(storeData);
        return processor;
    }
    async update(req) {
        const { id } = req.params;
        const updateData = req.body;
        // Validate the update data
        this.service.validateCreateOrUpdate(updateData);
        if (updateData.type) {
            const foundOneWithSameName = await this.service.findOne({
                where: { type: updateData.type, id: { [sequelize_1.Op.ne]: id } },
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
        (0, generalFunctions_1.validateUUID)(id, "invalid processor id");
        await this.service.findOneByIdOrThrowError(id);
        const count = await this.productService.count({
            where: { processorId: id },
        });
        if (count > 0) {
            throw new appError_1.AppError("processError", 403);
        }
        // Delete the brand
        return this.service.delete(id);
    }
    async get(req) {
        const { id } = req.params;
        const brand = await this.service.findOneByIdOrThrowError(id, {
            attributes: ["id", "type"],
        });
        return brand;
    }
    async getAll(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search } = req.query;
        const lng = req.language;
        this.service.validateGetAllStoresQuery({ search });
        const options = {
            attributes: ["id", "type"],
            offset,
            limit,
            order: [[orderBy, order]],
            where: {},
        };
        if (search) {
            search = search.toString().replace(/\+/g, "").trim();
            options.where.type = {
                [sequelize_1.Op.or]: [
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`type`)), "LIKE", "%" + search.toLowerCase() + "%"),
                ],
            };
        }
        const date = await this.service.getAll(options);
        return date;
    }
}
exports.ProcessorController = ProcessorController;
ProcessorController.instance = null;
