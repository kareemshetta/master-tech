"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeController = void 0;
const sequelize_1 = require("sequelize");
const appError_1 = require("../../../../utils/appError");
const attributes_service_1 = __importDefault(require("./attributes.service"));
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const config_1 = __importDefault(require("../../../../config/db/config"));
class AttributeController {
    constructor() {
        this.attributesService = attributes_service_1.default.getInstance();
    }
    static getInstance() {
        if (!AttributeController.instance) {
            AttributeController.instance = new AttributeController();
        }
        return AttributeController.instance;
    }
    async create(req) {
        const storeData = req.body;
        // Validate the incoming data
        this.attributesService.validateCreate(storeData);
        const foundOneWithSameData = await this.attributesService.findOne({
            where: { type: storeData.type, value: storeData.value?.toLowerCase() },
        });
        if (foundOneWithSameData) {
            throw new appError_1.AppError("entityWithNameExist", 409);
        }
        // Create the attr
        const attr = await this.attributesService.create(storeData);
        return attr;
    }
    async update(req) {
        const { id } = req.params;
        const updateData = req.body;
        // Validate the update data
        this.attributesService.validateUpdate(updateData);
        const foundOneWithSameName = await this.attributesService.findOne({
            where: {
                type: updateData.type,
                value: updateData.value,
                id: { [sequelize_1.Op.ne]: id },
            },
        });
        if (foundOneWithSameName) {
            throw new appError_1.AppError("entityWithNameExist", 409);
        }
        // Find the attr first
        const attr = await this.attributesService.findOneByIdOrThrowError(id);
        // Update the attr
        const updatedCat = await attr.update(updateData);
        return updatedCat;
    }
    async delete(req) {
        const { id } = req.params;
        // Delete the attr
        return this.attributesService.delete(id);
    }
    async getAttribute(req) {
        const { id } = req.params;
        const attr = await this.attributesService.findOneByIdOrThrowError(id, {});
        return attr;
    }
    async getAllAttributes(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search, type } = req.query;
        this.attributesService.validateGetAllQuery({ search });
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
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col("product_attributes.type")), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`product_attributes."value"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                ],
            };
        }
        if (type) {
            options.where.type = type;
        }
        const date = await this.attributesService.getAll(options);
        return date;
    }
}
exports.AttributeController = AttributeController;
AttributeController.instance = null;
