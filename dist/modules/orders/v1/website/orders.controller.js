"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const orders_service_1 = __importDefault(require("./orders.service"));
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const orderItem_model_1 = __importDefault(require("../../../../models/orderItem.model"));
const products_model_1 = __importDefault(require("../../../../models/products.model"));
const product_skus_model_1 = require("../../../../models/product_skus.model");
class OrderController {
    constructor() {
        this.service = orders_service_1.default.getInstance();
    }
    static getInstance() {
        if (!OrderController.instance) {
            OrderController.instance = new OrderController();
        }
        return OrderController.instance;
    }
    async create(req) {
        const storeData = req.body;
        const cartId = req.user?.cart?.id;
        const userId = req.user?.id;
        this.service.validateCreateOrder({ ...storeData, userId });
        const order = await this.service.create({ ...storeData, userId }, cartId);
        return order;
    }
    async update(req) {
        const { id } = req.params;
        const updateData = req.body;
        // Validate the update data
        this.service.validateUpdate(updateData);
        // if (updateData.name) {
        //   const foundOneWithSameName = await this.service.findOne({
        //     where: { name: updateData.name, id: { [Op.ne]: id } },
        //   });
        //   if (foundOneWithSameName) {
        //     throw new AppError("entityWithNameExist", 409);
        //   }
        // }
        // Find the order first
        const order = await this.service.findOneByIdOrThrowError(id);
        // Update the order
        const updated = await order.update(updateData);
        return updated;
    }
    //   public async delete(req: Request) {
    //     const { id } = req.params;
    //     // Delete the order
    //     return this.service.delete(id);
    //   }
    async getOne(req) {
        const { id } = req.params;
        const order = await this.service.findOneByIdOrThrowError(id, {
            attributes: {
                exclude: [
                    "deletedAt",
                    "updatedAt",
                    "status",
                    "paymentStatus",
                    "storeId",
                ],
            },
            include: [
                {
                    model: orderItem_model_1.default,
                    attributes: ["id", "quantity", "price", "cartId", "skuId"],
                    include: [
                        {
                            model: products_model_1.default,
                            attributes: ["id", "name", "description", "image"],
                        },
                        { model: product_skus_model_1.ProductSku, attributes: ["id", "sku"] },
                    ],
                },
            ],
        });
        return order;
    }
    async getAll(req) {
        // Calculate offset for pagination
        const userId = req.user?.id;
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search } = req.query;
        this.service.validateGetAllQuery({ search });
        const options = {
            attributes: {
                exclude: [
                    "deletedAt",
                    "updatedAt",
                    "status",
                    "paymentStatus",
                    "storeId",
                ],
            },
            offset,
            limit,
            order: [[orderBy, order]],
            where: {
                userId,
            },
            include: [
                {
                    model: orderItem_model_1.default,
                    attributes: ["id", "quantity", "price", "cartId", "skuId"],
                    include: [
                        {
                            model: products_model_1.default,
                            attributes: ["id", "name", "description", "image"],
                        },
                        { model: product_skus_model_1.ProductSku, attributes: ["id", "price", "sku"] },
                    ],
                },
            ],
        };
        const date = await this.service.getAll(options);
        return date;
    }
}
exports.OrderController = OrderController;
OrderController.instance = null;
