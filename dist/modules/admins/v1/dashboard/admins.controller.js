"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const generalFunctions_1 = require("../../../../utils/generalFunctions");
const appError_1 = require("../../../../utils/appError");
const admins_service_1 = __importDefault(require("./admins.service"));
const stores_service_1 = __importDefault(require("../../../stores/v1/dashboard/stores.service"));
const sequelize_1 = require("sequelize");
class AdminController {
    constructor() {
        this.service = admins_service_1.default.getInstance();
        this.storeService = stores_service_1.default.getInstance();
    }
    static getInstance() {
        if (!AdminController.instance) {
            AdminController.instance = new AdminController();
        }
        return AdminController.instance;
    }
    async getAll(req) {
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let storeId = req.user?.storeId;
        let options = {
            attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
            offset,
            limit,
            where: {},
            order: [[orderBy, order]],
        };
        if (req.user?.role != "superAdmin" && storeId)
            options.where.storeId = storeId;
        return this.service.getAll(options);
    }
    async create(req) {
        const body = req.body;
        this.service.validateCreateAdmin(body);
        const found = await this.service.findOne({
            where: { email: body.email?.toLowerCase() },
        });
        if (found) {
            throw new appError_1.AppError("entityWithEmialExist", 409);
        }
        const store = await this.storeService.findOneByIdOrThrowError(body.storeId);
        const data = (await this.service.create(body)).toJSON();
        delete data.password;
        return data;
    }
    async update(req) {
        const { id } = req.params;
        (0, generalFunctions_1.validateUUID)(id, "invalid Admin id");
        const body = req.body;
        this.service.validateUpdateAdmin(body);
        const found = await this.service.findOne({
            where: { email: body.email?.toLowerCase(), id: { [sequelize_1.Op.ne]: id } },
        });
        if (found) {
            throw new appError_1.AppError("entityWithEmialExist", 409);
        }
        const admin = await this.service.findOneByIdOrThrowError(id);
        const updated = (await admin.update(body, { returning: true })).toJSON();
        delete updated.password;
        return updated;
    }
    async getOne(req) {
        const { id } = req.params;
        (0, generalFunctions_1.validateUUID)(id, "invalid Admin id");
        return this.service.findOneByIdOrThrowError(id, {
            attributes: {
                exclude: ["deletedAt", "updatedAt"],
            },
        });
    }
    async deleteOne(req) {
        const { id } = req.params;
        (0, generalFunctions_1.validateUUID)(id, "invalid Admin id");
        return this.service.delete(id);
    }
}
exports.AdminController = AdminController;
AdminController.instance = null;
exports.default = AdminController;
