"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const generalFunctions_1 = require("../../../../utils/generalFunctions");
const appError_1 = require("../../../../utils/appError");
const admins_service_1 = __importDefault(require("../../../admins/v1/dashboard/admins.service"));
const sequelize_1 = require("sequelize");
class AuthController {
    constructor() {
        this.service = admins_service_1.default.getInstance();
    }
    static getInstance() {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController();
        }
        return AuthController.instance;
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
    async signUp(req) {
        const body = req.body;
        this.service.validateCreateAdmin(body);
        const found = await this.service.findOne({
            where: { email: body.email?.toLowerCase() },
        });
        if (found) {
            throw new appError_1.AppError("entityWithEmialExist", 409);
        }
        const data = (await this.service.create(body)).toJSON();
        const token = (0, generalFunctions_1.generateToken)({
            id: data.id,
            email: data.email,
            role: data.role,
        });
        delete data.password;
        return { data, token };
    }
    async login(req) {
        const body = req.body;
        this.service.validateLoginAdmin(body);
        const found = (await this.service.findOne({
            where: { email: body.email?.toLowerCase() },
            attributes: { exclude: ["updatedAt", "role"] },
        }))?.toJSON();
        if (!found) {
            throw new appError_1.AppError("wrongCredentials", 401);
        }
        const isTruePassword = await (0, generalFunctions_1.comparePassword)(body.password, found.password);
        if (!isTruePassword)
            throw new appError_1.AppError("wrongCredentials", 401);
        const token = (0, generalFunctions_1.generateToken)({
            id: found.id,
            email: found.email,
            role: found.role,
        });
        delete found.password;
        return { date: found, token };
    }
    async update(req) {
        const { id } = req.user;
        (0, generalFunctions_1.validateUUID)(id, "invalid user id");
        const body = req.body;
        this.service.validateUpdateAdmin(body);
        if (body.email) {
            const found = await this.service.findOne({
                where: { email: body.email?.toLowerCase(), id: { [sequelize_1.Op.ne]: id } },
            });
            if (found) {
                throw new appError_1.AppError("entityWithEmialExist", 409);
            }
        }
        const admin = await this.service.findOneByIdOrThrowError(id);
        const updated = (await admin.update(body, { returning: true })).toJSON();
        delete updated.password;
        return updated;
        // Implementation commented out in original code
    }
    async getOne(req) {
        const { id } = req.user;
        (0, generalFunctions_1.validateUUID)(id, "invalid user id");
        return this.service.findOneByIdOrThrowError(id, {
            attributes: {
                exclude: ["deletedAt", "updatedAt", "password"],
            },
        });
    }
    async deleteOne(req) {
        const { id } = req.params;
        (0, generalFunctions_1.validateUUID)(id, "invalid trainer id");
        return this.service.delete(id);
    }
}
exports.AuthController = AuthController;
AuthController.instance = null;
exports.default = AuthController;
