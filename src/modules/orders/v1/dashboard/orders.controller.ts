import { Op } from "sequelize";
import { AppError } from "../../../../utils/appError";
import { ICart, IOrder } from "../../../../utils/shared.types";
import OrderService from "./orders.service";
import { Request } from "express";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import sequelize from "../../../../config/db/config";
import OrderItem from "../../../../models/orderItem.model";
import Product from "../../../../models/products.model";
import { ProductSku } from "../../../../models/product_skus.model";

export class OrderController {
  private static instance: OrderController | null = null;
  private service: OrderService;

  private constructor() {
    this.service = OrderService.getInstance();
  }

  public static getInstance(): OrderController {
    if (!OrderController.instance) {
      OrderController.instance = new OrderController();
    }
    return OrderController.instance;
  }

  public async create(req: Request) {
    const storeData: IOrder = req.body;
    const cartId = req.user?.cart?.id;

    const userId = req.user?.id;
    this.service.validateCreateOrder({ ...storeData, userId });
    const order = await this.service.create({ ...storeData, userId }, cartId!);
    return order;
  }
  public async update(req: Request) {
    const { id } = req.params;
    const updateData: Partial<IOrder> = req.body;

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

  public async delete(req: Request) {
    const { id } = req.params;

    // Delete the order
    return this.service.delete(id);
  }

  public async getOne(req: Request) {
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
          model: OrderItem,
          attributes: ["id", "quantity", "price", "cartId", "skuId"],
          include: [
            {
              model: Product,
              attributes: ["id", "name", "description", "image"],
            },
            { model: ProductSku, attributes: ["id", "sku"] },
          ],
        },
      ],
    });

    return order;
  }

  public async getAll(req: Request) {
    // Calculate offset for pagination

    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search } = req.query;
    this.service.validateGetAllQuery({ search });
    const options: any = {
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

      include: [
        {
          model: OrderItem,
          attributes: ["id", "quantity", "price", "cartId", "skuId"],
          include: [
            {
              model: Product,
              attributes: ["id", "name", "description", "image"],
            },
            { model: ProductSku, attributes: ["id", "price", "sku"] },
          ],
        },
      ],
    };

    const date = await this.service.getAll(options);

    return date;
  }
}
