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
const config_1 = __importDefault(require("../../../../config/db/config"));
const stores_model_1 = __importDefault(require("../../../../models/stores.model"));
const enums_1 = require("../../../../utils/enums");
const product_sku_repository_1 = __importDefault(require("../../../products/v1/product.sku.repository"));
class CartController {
    constructor() {
        this.cartService = carts_service_1.default.getInstance();
        this.productService = products_service_1.default.getInstance();
        this.productSkuRepo = product_sku_repository_1.default.getInstance();
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
            attributes: ["id", "storeId", "categoryType", "quantity"],
        })).toJSON();
        const foundCart = (await this.cartService.getCart({
            where: { id: cart?.id },
            include: [
                {
                    model: cartItem_model_1.default,
                    attributes: ["id"],
                    include: [{ model: products_model_1.default, attributes: ["storeId"] }],
                    limit: 1,
                },
            ],
        }))?.toJSON();
        if (foundCart?.cart_items?.length &&
            foundCart.cart_items[0]?.Product?.storeId !== cartProduct.storeId) {
            throw new appError_1.AppError("cartItemsMustBeFromSameStore", 403);
        }
        const cartItem = await this.cartService.findOne({
            attributes: ["id", "quantity", "price", "skuId"],
            where: { cartId: cart?.id, productId: storeData.productId },
        });
        // check if the product exists on the cart
        if (!cartItem) {
            if (cartProduct.categoryType == enums_1.CategoryType.ACCESSORY) {
                if (!cartItem && cartProduct.quantity < storeData.quantity) {
                    throw new appError_1.AppError("productQuantityLessThanOrder", 409);
                }
            }
            if (cartProduct.categoryType == enums_1.CategoryType.LAPTOP) {
                const sku = (await this.productSkuRepo.findOneByIdOrThrowError(storeData.skuId));
                if (sku.quantity < storeData.quantity) {
                    throw new appError_1.AppError("productQuantityLessThanOrder", 409);
                }
            }
            // Create the cat
            const cat = await this.cartService.createCartItem(storeData);
            return cat;
        }
        else {
            if (cartProduct.categoryType == enums_1.CategoryType.ACCESSORY) {
                if (cartItem.quantity + storeData.quantity > cartProduct.quantity) {
                    throw new appError_1.AppError("productQuantityLessThanOrder", 409);
                }
                const updatedCat = await cartItem.update({
                    quantity: cartItem.quantity + storeData.quantity,
                });
                return updatedCat;
            }
            if (cartProduct.categoryType == enums_1.CategoryType.LAPTOP) {
                const sku = (await this.productSkuRepo.findOneByIdOrThrowError(storeData.skuId));
                if (cartItem.quantity + storeData.quantity > sku.quantity) {
                    throw new appError_1.AppError("productQuantityLessThanOrder", 409);
                }
                const updatedCat = await cartItem.update({
                    quantity: cartItem.quantity + storeData.quantity,
                });
                return updatedCat;
            }
        }
    }
    async update(req) {
        const { id } = req.params;
        const updateData = req.body;
        // Validate the update data
        this.cartService.validateUpdateItem({ ...updateData, id });
        // Find the cat first
        const cat = await this.cartService.findOneByIdOrThrowError(id, {
            include: {
                model: products_model_1.default,
                attributes: ["id", "categoryType", "quantity"],
            },
        });
        // console.log("cat", cat.Product.dataValues);
        if (cat.Product.dataValues.categoryType == enums_1.CategoryType.ACCESSORY &&
            cat.Product.dataValues.quantity < updateData.quantity) {
            throw new appError_1.AppError("productQuantityLessThanOrder", 422);
        }
        if (cat.Product.dataValues.categoryType == enums_1.CategoryType.LAPTOP) {
            const sku = (await this.productSkuRepo.findOneByIdOrThrowError(cat.skuId));
            if (sku.quantity < updateData.quantity) {
                throw new appError_1.AppError("productQuantityLessThanOrder", 422);
            }
        }
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
        const lng = req.language;
        const nameColumn = lng === "ar" ? "nameAr" : "name";
        const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
        const foundCart = (await this.cartService.getCart({
            attributes: [
                "id",
                [
                    config_1.default.literal(`
        COALESCE(
            (
                SELECT SUM(CAST("CartItems"."quantity" AS DECIMAL) * CAST("CartItems"."price" AS DECIMAL))
                FROM "cart_items" AS "CartItems"
                WHERE "CartItems"."cartId" = "carts"."id"
                AND "CartItems"."deletedAt" IS NULL
            ), 0
        )
    `),
                    "totalPrice",
                ],
            ],
            // logging: console.log,
            where: { id: cart?.id },
            include: [
                {
                    order: [["createdAt", "ASC"]],
                    model: cartItem_model_1.default,
                    attributes: ["id", "quantity", "price"],
                    include: [
                        {
                            model: products_model_1.default,
                            attributes: [
                                "id",
                                `${nameColumn}`,
                                `${descriptionColumn}`,
                                "image",
                            ],
                            include: [
                                {
                                    model: stores_model_1.default,
                                    attributes: ["allowShipping", nameColumn],
                                    as: "store",
                                },
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
        }))?.toJSON();
        // const options: any = {
        //   offset,
        //   limit,
        //   order: [[orderBy, order]],
        //   where: { cartId: cart?.id },
        //   include: [
        //     {
        //       model: Product,
        //       attributes: ["id", `${nameColumn}`, `${descriptionColumn}`, "image"],
        //     },
        //     {
        //       model: ProductSku,
        //       attributes: ["sku", "price"],
        //       include: [
        //         {
        //           model: ProductAttribute,
        //           attributes: ["type", "value"],
        //           as: "color",
        //         },
        //         {
        //           model: ProductAttribute,
        //           attributes: ["type", "value"],
        //           as: "storage",
        //         },
        //       ],
        //     },
        //   ],
        // };
        // const date = await this.cartService.getAll(options);
        return foundCart;
    }
}
exports.CartController = CartController;
CartController.instance = null;
