"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const generalFunctions_1 = require("../../../../utils/generalFunctions");
const appError_1 = require("../../../../utils/appError");
const users_service_1 = __importDefault(require("./users.service"));
class UserController {
    constructor() {
        this.service = users_service_1.default.getInstance();
    }
    static getInstance() {
        if (!UserController.instance) {
            UserController.instance = new UserController();
        }
        return UserController.instance;
    }
    async getAll(req) {
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        return this.service.getAll({
            attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
            offset,
            limit,
            order: [[orderBy, order]],
        });
    }
    async create(req) {
        const body = req.body;
        this.service.validateCreateUser(body);
        const found = await this.service.findOne({
            where: { email: body.email?.toLowerCase() },
        });
        if (found) {
            throw new appError_1.AppError("entityWithEmialExist", 409);
        }
        const data = await this.service.create(body);
        return data;
    }
    async update(req) {
        const { id } = req.params;
        // Implementation commented out in original code
    }
    async getOne(req) {
        const { id } = req.params;
        (0, generalFunctions_1.validateUUID)(id, "invalid user id");
        return this.service.findOneByIdOrThrowError(id, {
            attributes: {
                exclude: ["deletedAt", "updatedAt"],
            },
        });
    }
    async deleteOne(req) {
        const { id } = req.params;
        (0, generalFunctions_1.validateUUID)(id, "invalid trainer id");
        return this.service.delete(id);
    }
}
exports.UserController = UserController;
UserController.instance = null;
exports.default = UserController;
