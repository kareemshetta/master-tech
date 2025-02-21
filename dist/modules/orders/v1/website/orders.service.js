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
const communication_functions_1 = require("../../../../utils/communication-functions");
const products_model_1 = __importDefault(require("../../../../models/products.model"));
const products_repository_1 = __importDefault(require("../../../products/v1/products.repository"));
const enums_1 = require("../../../../utils/enums");
class OrderService {
    constructor() {
        this.repo = orders_repository_1.default.getInstance();
        this.orderItemrepo = orderItem_repository_1.default.getInstance();
        this.cartItemRepo = cartItem_repository_1.default.getInstance();
        this.cartRepo = carts_repository_1.default.getInstance();
        this.productSkuRepo = product_sku_repository_1.default.getInstance();
        this.PrdouctRepo = products_repository_1.default.getInstance();
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
                    include: [
                        {
                            model: products_model_1.default,
                            attributes: ["storeId", "categoryType"],
                        },
                    ],
                },
            ],
        }))?.toJSON();
        if (!cart || !cart["cart_items"]?.length) {
            throw new appError_1.AppError("cartIsEmpty", 404);
        }
        const itemsStoreId = cart["cart_items"].map((item) => item.Product.storeId);
        // if (
        //   itemsStoreId.length &&
        //   itemsStoreId.every((id) => id !== itemsStoreId[0])
        // ) {
        //   throw new AppError("ordersItemsMustBeFromSameStore", 409);
        // }
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
                storeId: itemsStoreId[0],
                status: "PENDING",
            }, { transaction })).toJSON();
            await Promise.all(cart["cart_items"].map(async (cartItem) => {
                await this.orderItemrepo.create({
                    orderId: order.id,
                    productId: cartItem.productId,
                    skuId: cartItem?.skuId || null,
                    quantity: cartItem.quantity,
                    price: cartItem.price,
                    cartId,
                }, { transaction });
                if (cartItem.skuId) {
                    const sku = await this.productSkuRepo.findOneById(cartItem.skuId, {
                        transaction,
                        paranoid: true,
                    });
                    if (sku) {
                        await sku.update({
                            quantity: sku.quantity - cartItem.quantity,
                        }, { transaction });
                    }
                }
                if (cartItem.Product?.categoryType == enums_1.CategoryType.ACCESSORY) {
                    const prod = await this.PrdouctRepo.findOneById(cartItem.productId);
                    if (prod) {
                        prod.update({
                            quantity: prod.quantity - cartItem.quantity,
                        }, { transaction });
                    }
                }
            }));
            await this.cartItemRepo.delete({
                where: { cartId },
                transaction,
                force: false, // Use soft delete
            });
            await this.cartRepo.update({ totalAmount: 0 }, { transaction: transaction, where: { id: cartId } });
            await transaction.commit();
            (0, communication_functions_1.sendEmail)([data.email], "Order Confirmation", this.generateOrderEmail(order, cart["cart_items"]));
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
            // storeId: Joi.string().uuid().required(),
            isDelivery: joi_1.default.boolean().required(),
            shippingAddress: joi_1.default.string()
                .trim()
                .when(joi_1.default.ref("isDelivery"), {
                is: true,
                then: joi_1.default.string().max(500).min(1).required(),
                otherwise: joi_1.default.string().length(0).allow(null, ""),
            }),
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
    generateOrderEmail(order, cartItems) {
        const itemsList = cartItems
            .map((item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productId}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${item.price * item.quantity}</td>
      </tr>
    `)
            .join("");
        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
        <p>Dear ${order.firstName} ${order.lastName},</p>
        <p>Thank you for your order. Here are your order details:</p>
  
        <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0;">
          <p><strong>Order ID:</strong> ${order.shortId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </div>
  
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f4f4f4;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: left;">Quantity</th>
              <th style="padding: 10px; text-align: left;">Price</th>
              <th style="padding: 10px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr style="background-color: #f4f4f4;">
              <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total Amount:</strong></td>
              <td style="padding: 10px;">$${order.totalAmount}</td>
            </tr>
          </tfoot>
        </table>
  
        <div style="margin-top: 20px;">
          <p>If you have any questions about your order, please contact our customer service.</p>
          <p>Best regards,<br>Your Store Team</p>
        </div>
      </div>
    `;
    }
}
exports.OrderService = OrderService;
OrderService.instance = null;
exports.default = OrderService;
