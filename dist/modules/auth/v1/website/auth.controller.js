"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const generalFunctions_1 = require("../../../../utils/generalFunctions");
const config_1 = __importDefault(require("../../../../config/db/config"));
const appError_1 = require("../../../../utils/appError");
const users_service_1 = __importDefault(require("../../../users/v1/dashboard/users.service"));
const communication_functions_1 = require("../../../../utils/communication-functions");
const carts_model_1 = __importDefault(require("../../../../models/carts.model"));
const cartItem_model_1 = __importDefault(require("../../../../models/cartItem.model"));
const products_model_1 = __importDefault(require("../../../../models/products.model"));
const product_skus_model_1 = require("../../../../models/product_skus.model");
const product_attributes_model_1 = __importDefault(require("../../../../models/product_attributes.model"));
class AuthController {
    constructor() {
        this.service = users_service_1.default.getInstance();
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
        let t = null;
        try {
            t = await config_1.default.transaction();
            const body = req.body;
            this.service.validateCreateUser(body);
            const found = await this.service.findOne({
                where: { email: body.email?.toLowerCase() },
            });
            if (found) {
                throw new appError_1.AppError("entityWithEmialExist", 409);
            }
            const data = (await this.service.create(body, { transaction: t })).toJSON();
            const cart = (await this.service.createCart(data.id, { transaction: t })).toJSON();
            const token = (0, generalFunctions_1.generateToken)({
                id: data.id,
                email: data.email,
                role: data.role,
            });
            delete data.password;
            await t.commit();
            return { data, token, cartId: cart.id };
        }
        catch (e) {
            console.log(e);
            if (t)
                await t.rollback();
            throw e;
        }
    }
    async login(req) {
        const body = req.body;
        const lng = req.language;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
        this.service.validateLoginUser(body);
        const found = (await this.service.findOne({
            where: { email: body.email?.toLowerCase() },
            attributes: {
                exclude: [
                    "updatedAt",
                    "role",
                    "createdAt",
                    "deletedAt",
                    "updatedAt",
                    "otp",
                    "status",
                    "otpChangedAt",
                    "otpCreatedAt",
                ],
            },
            include: [
                {
                    model: products_model_1.default,
                    attributes: [
                        "id",
                        [config_1.default.col(`"${nameColumn}"`), "name"],
                        [config_1.default.col(`"${descriptionColumn}"`), "description"],
                    ],
                    through: { attributes: [] },
                },
                {
                    model: carts_model_1.default,
                    attributes: ["id"],
                    include: [
                        {
                            model: cartItem_model_1.default,
                            attributes: ["id", "quantity", "price"],
                            include: [
                                {
                                    model: products_model_1.default,
                                    attributes: [
                                        "id",
                                        [config_1.default.col(`"${nameColumn}"`), "name"],
                                        [config_1.default.col(`"${descriptionColumn}"`), "description"],
                                    ],
                                },
                                {
                                    model: product_skus_model_1.ProductSku,
                                    attributes: ["sku", "price"],
                                    include: [
                                        {
                                            model: product_attributes_model_1.default,
                                            attributes: ["type", "value"],
                                            as: "color",
                                        },
                                        {
                                            model: product_attributes_model_1.default,
                                            attributes: ["type", "value"],
                                            as: "storage",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
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
            cartId: found.cart?.id,
        });
        delete found.password;
        return { date: found, token };
    }
    async update(req) {
        const { id } = req.params;
        // Implementation commented out in original code
    }
    async getOne(req) {
        const { id } = req.user;
        (0, generalFunctions_1.validateUUID)(id, "invalid user id");
        const lng = req.language;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
        return this.service.findOneByIdOrThrowError(id, {
            attributes: {
                exclude: ["deletedAt", "updatedAt", "password"],
            },
            include: [
                {
                    model: products_model_1.default,
                    attributes: [
                        "id",
                        [config_1.default.col(`"${nameColumn}"`), "name"],
                        [config_1.default.col(`"${descriptionColumn}"`), "description"],
                    ],
                    through: { attributes: [] },
                },
                {
                    model: carts_model_1.default,
                    attributes: ["id"],
                    include: [
                        {
                            model: cartItem_model_1.default,
                            attributes: ["id", "quantity", "price"],
                            include: [
                                {
                                    model: products_model_1.default,
                                    attributes: [
                                        "id",
                                        [config_1.default.col(`"${nameColumn}"`), "name"],
                                        [config_1.default.col(`"${descriptionColumn}"`), "description"],
                                    ],
                                },
                                {
                                    model: product_skus_model_1.ProductSku,
                                    attributes: ["sku", "price"],
                                    include: [
                                        {
                                            model: product_attributes_model_1.default,
                                            attributes: ["type", "value"],
                                            as: "color",
                                        },
                                        {
                                            model: product_attributes_model_1.default,
                                            attributes: ["type", "value"],
                                            as: "storage",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    }
    async getOtp(req) {
        const body = req.body;
        this.service.validateEmail(body.email);
        const found = await this.service.findOne({
            where: { email: body.email?.toLowerCase() },
            attributes: { exclude: ["updatedAt", "role"] },
        });
        if (!found) {
            throw new appError_1.AppError("wrongCredentials", 401);
        }
        const otp = (0, generalFunctions_1.generateSecureOTP)();
        await found.update({ otp, otpCreatedAt: new Date() });
        (0, communication_functions_1.sendEmail)([body.email], "otp", `<p>your otp ${otp} which is valid for 15 seconds`);
        return "you will recieve an email with otp shortly";
    }
    async verifyOtp(req) {
        const body = req.body;
        this.service.validateVerifyOtp(body);
        const found = (await this.service.findOne({
            where: { email: body.email?.toLowerCase() },
            attributes: ["email", "otp", "otpCreatedAt"],
        }))?.toJSON();
        if (!found) {
            throw new appError_1.AppError("wrongCredentials", 401);
        }
        console.log(found.otp, body.otp, (0, generalFunctions_1.isNowGreaterThanBy15Minutes)(new Date(found.otpCreatedAt)));
        if (found.otp != body.otp) {
            throw new appError_1.AppError("wrongOtp", 401);
        }
        if ((0, generalFunctions_1.isNowGreaterThanBy15Minutes)(new Date(found.otpCreatedAt))) {
            throw new appError_1.AppError("otpExpired", 401);
        }
        return "yourOtpHavePassedSuccess";
    }
    async updatePassword(req) {
        const body = req.body;
        this.service.validateUpdatePassword(body);
        const found = await this.service.findOne({
            where: { email: body.email?.toLowerCase() },
            attributes: ["email", "otp", "otpCreatedAt"],
        });
        const foundJson = found?.toJSON();
        if (!found) {
            throw new appError_1.AppError("wrongCredentials", 401);
        }
        if (foundJson.otp != body.otp) {
            throw new appError_1.AppError("wrongOtp", 401);
        }
        if ((0, generalFunctions_1.isNowGreaterThanBy15Minutes)(new Date(foundJson.otpCreatedAt))) {
            throw new appError_1.AppError("otpExpired", 401);
        }
        const password = await (0, generalFunctions_1.hashPassword)(body.password);
        const updated = await this.service.updateOne({ password: password, otp: null, otpCreatedAt: null }, { where: { email: body.email?.toLowerCase() } });
        return updated;
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
