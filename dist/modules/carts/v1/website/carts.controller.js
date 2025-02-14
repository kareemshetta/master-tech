"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const carts_service_1 = __importDefault(require("./carts.service"));
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const products_model_1 = __importDefault(require("../../../../models/products.model"));
const product_skus_model_1 = require("../../../../models/product_skus.model");
const product_attributes_model_1 = __importDefault(require("../../../../models/product_attributes.model"));
const cartItem_model_1 = __importDefault(require("../../../../models/cartItem.model"));
const products_service_1 = __importDefault(require("../../../products/v1/dashboard/products.service"));
const appError_1 = require("../../../../utils/appError");
class CartController {
    constructor() {
        this.cartService = carts_service_1.default.getInstance();
        this.productService = products_service_1.default.getInstance();
    }
    static getInstance() {
        if (!CartController.instance) {
            CartController.instance = new CartController();
        }
        return CartController.instance;
    }
    async create(req) {
        const storeData = req.body;
        const { cart } = req.user;
        storeData.cartId = cart?.id;
        // Validate the incoming data
        this.cartService.validateCreateItem(storeData);
        const cartProduct = (await this.productService.findOneByIdOrThrowError(storeData.productId, {
            attributes: ["id", "storeId"],
        })).toJSON();
        const foundCart = (await this.cartService.getCart({
            where: { id: cart?.id },
            include: [
                {
                    model: cartItem_model_1.default,
                    attributes: ["id"],
                    include: [{ model: products_model_1.default, attributes: ["storeId"] }],
                },
            ],
        }))?.toJSON();
        if (foundCart?.cart_items?.length &&
            foundCart.cart_items[0]?.Product?.storeId !== cartProduct.storeId) {
            throw new appError_1.AppError("cartItemsMustBeFromSameStore", 403);
        }
        // Create the cat
        const cat = await this.cartService.createCartItem(storeData);
        return cat;
    }
    async update(req) {
        const { id } = req.params;
        const updateData = req.body;
        // Validate the update data
        this.cartService.validateUpdateItem({ ...updateData, id });
        // Find the cat first
        const cat = await this.cartService.findOneByIdOrThrowError(id);
        // Update the cat
        const updatedCat = await cat.update(updateData);
        return updatedCat;
    }
    async delete(req) {
        const { id } = req.params;
        const cat = await this.cartService.findOneByIdOrThrowError(id);
        // Delete the cat
        return this.cartService.delete(id);
    }
    async getOne(req) {
        const { id } = req.params;
        const cat = await this.cartService.findOneByIdOrThrowError(id, {
            attributes: ["id", "price", "quantity"],
            include: [
                { model: products_model_1.default, attributes: ["id", "name", "description"] },
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
        });
        return cat;
    }
    async getAll(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        const { cart } = req.user;
        const options = {
            offset,
            limit,
            order: [[orderBy, order]],
            where: { cartId: cart?.id },
        };
        const date = await this.cartService.getAll(options);
        return date;
    }
}
exports.CartController = CartController;
CartController.instance = null;
