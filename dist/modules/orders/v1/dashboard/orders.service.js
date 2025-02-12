"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const orders_repository_1 = __importDefault(require("../orders.repository"));
const orderItem_repository_1 = __importDefault(require("../orderItem.repository"));
const appError_1 = require("../../../../utils/appError");
const joi_1 = __importDefault(require("joi"));
const constant_1 = require("../../../../utils/constant");
const cartItem_repository_1 = __importDefault(require("../../../carts/v1/cartItem.repository"));
const carts_repository_1 = __importDefault(require("../../../carts/v1/carts.repository"));
const cartItem_model_1 = __importDefault(require("../../../../models/cartItem.model"));
const config_1 = __importDefault(require("../../../../config/db/config"));
const product_sku_repository_1 = __importDefault(require("../../../products/v1/product.sku.repository"));
class OrderService {
    constructor() {
        this.repo = orders_repository_1.default.getInstance();
        this.orderItemrepo = orderItem_repository_1.default.getInstance();
        this.cartItemRepo = cartItem_repository_1.default.getInstance();
        this.cartRepo = carts_repository_1.default.getInstance();
        this.productSkuRepo = product_sku_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }
    async create(data, cartId) {
        const cart = (await this.cartRepo.findOne({
            where: { userId: data.userId },
            include: [
                {
                    model: cartItem_model_1.default,
                    attributes: [
                        "id",
                        "quantity",
                        "price",
                        "cartId",
                        "productId",
                        "skuId",
                    ],
                },
            ],
        }))?.toJSON();
        if (!cart || !cart["cart_items"]?.length) {
            throw new appError_1.AppError("cartIsEmpty", 404);
        }
        let transaction = null;
        try {
            transaction = await config_1.default.transaction();
            const order = (await this.repo.create({
                userId: data.userId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                totalAmount: data.totalAmount,
                shippingAddress: data.shippingAddress,
                status: "PENDING",
            }, { transaction })).toJSON();
            await Promise.all(cart["cart_items"].map(async (cartItem) => {
                await this.orderItemrepo.create({
                    orderId: order.id,
                    productId: cartItem.productId,
                    skuId: cartItem.skuId,
                    quantity: cartItem.quantity,
                    price: cartItem.price,
                    cartId,
                }, { transaction });
                const sku = await this.productSkuRepo.findOneById(cartItem.skuId, {
                    transaction,
                    paranoid: true,
                });
                if (sku) {
                    await sku.update({
                        quantity: sku.quantity - cartItem.quantity,
                    }, { transaction });
                }
            }));
            await this.cartItemRepo.delete({
                where: { cartId },
                transaction,
                force: false, // Use soft delete
            });
            await this.cartRepo.update({ totalAmount: 0 }, { transaction: transaction, where: { id: cartId } });
            await transaction.commit();
            return order;
        }
        catch (err) {
            if (transaction)
                await transaction.rollback();
            throw err;
        }
    }
    async delete(catId) {
        return this.repo.delete({ where: { id: catId } });
    }
    async findOneByIdOrThrowError(catId, options = {}) {
        return this.repo.findOneByIdOrThrowError(catId, options);
    }
    async findOne(options = {}) {
        return this.repo.findOne(options);
    }
    async getAll(options = {}) {
        return this.repo.findAndCountAll(options);
    }
    async buLkCreate(data, options) {
        return this.orderItemrepo.bulkCreate(data, options);
    }
    validateCreateOrder(data) {
        const schema = joi_1.default.object({
            firstName: joi_1.default.string().trim().max(50).min(1).required(),
            lastName: joi_1.default.string().trim().max(50).min(1).required(),
            email: joi_1.default.string().max(255).email().required(),
            phoneNumber: joi_1.default.string()
                .regex(constant_1.PHONE_NUMBER_VALIDATION)
                .required()
                .messages({
                "string.base": "phoneNumber must be a string.",
                "string.empty": "phoneNumber cannot be empty.",
                "string.pattern.base": "Please enter a valid Phone Number.",
                "any.required": "phoneNumber is required and cannot be null.",
            }),
            totalAmount: joi_1.default.number().required(),
            userId: joi_1.default.string().uuid().required(),
            shippingAddress: joi_1.default.string().trim().max(500).min(1).required(),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateUpdate(data) {
        const schema = joi_1.default.object({
            image: joi_1.default.string()
                .trim()
                .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
                .messages({
                "string.base": "Image must be a string.",
                "string.pattern.base": "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
            })
                .allow(null, ""),
            name: joi_1.default.string().trim().max(255).messages({
                "string.base": "name must be a string.",
                "string.max": "name cannot exceed 255 characters.",
            }),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateGetAllQuery(query) {
        const schema = joi_1.default.object({
            search: joi_1.default.string().trim().max(255).allow("").messages({
                "string.base": "Search term must be a string.",
                "string.max": "Search term cannot exceed 255 characters.",
            }),
        });
        const { error } = schema.validate(query);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
}
exports.OrderService = OrderService;
OrderService.instance = null;
exports.default = OrderService;
