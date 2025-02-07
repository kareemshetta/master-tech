import {
  BulkCreateOptions,
  FindAndCountOptions,
  FindOptions,
  Transaction,
} from "sequelize";
import {
  ICart,
  ICategory,
  IOrder,
  IOrderItem,
} from "../../../../utils/shared.types";
import OrderRepo from "../orders.repository";
import OrderItemRepo from "../orderItem.repository";
import { AppError, ValidationError } from "../../../../utils/appError";
import Joi from "joi";
import { PHONE_NUMBER_VALIDATION } from "../../../../utils/constant";
import CartItemRepo from "../../../carts/v1/cartItem.repository";
import CartRepo from "../../../carts/v1/carts.repository";
import CartItem from "../../../../models/cartItem.model";
import sequelize from "../../../../config/db/config";
import { t } from "i18next";
import ProductSkuRepository from "../../../products/v1/product.sku.repository";

export class OrderService {
  private static instance: OrderService | null = null;
  private repo: OrderRepo;
  private orderItemrepo: OrderItemRepo;
  private cartItemRepo: CartItemRepo;
  private cartRepo: CartRepo;
  private productSkuRepo: ProductSkuRepository;

  private constructor() {
    this.repo = OrderRepo.getInstance();
    this.orderItemrepo = OrderItemRepo.getInstance();
    this.cartItemRepo = CartItemRepo.getInstance();
    this.cartRepo = CartRepo.getInstance();
    this.productSkuRepo = ProductSkuRepository.getInstance();
  }

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  public async create(data: IOrder, cartId: string) {
    const cart = (
      await this.cartRepo.findOne({
        where: { userId: data.userId },
        include: [
          {
            model: CartItem,
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
      })
    )?.toJSON() as ICart;

    if (!cart || !cart["cart_items"]?.length) {
      throw new AppError("cartIsEmpty", 404);
    }
    let transaction: Transaction | null = null;
    try {
      transaction = await sequelize.transaction();

      const order = (
        await this.repo.create(
          {
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            totalAmount: data.totalAmount,
            shippingAddress: data.shippingAddress,

            status: "PENDING",
          },
          { transaction }
        )
      ).toJSON() as IOrder;

      await Promise.all(
        cart["cart_items"].map(async (cartItem) => {
          await this.orderItemrepo.create(
            {
              orderId: order.id,
              productId: cartItem.productId,
              skuId: cartItem.skuId,
              quantity: cartItem.quantity,
              price: cartItem.price,
              cartId,
            },
            { transaction }
          );

          const sku: any = await this.productSkuRepo.findOneById(
            cartItem.skuId!,
            {
              transaction,
              paranoid: true,
            }
          );

          if (sku) {
            await sku.update(
              {
                quantity: sku.quantity - cartItem.quantity!,
              },
              { transaction }
            );
          }
        })
      );

      await this.cartItemRepo.delete({
        where: { cartId },
        transaction,
        force: false, // Use soft delete
      });

      await this.cartRepo.update(
        { totalAmount: 0 },
        { transaction: transaction, where: { id: cartId } }
      );

      await transaction.commit();
      return order;
    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }
  }

  public async delete(catId: string) {
    return this.repo.delete({ where: { id: catId } });
  }

  public async findOneByIdOrThrowError(
    catId: string,
    options: FindOptions = {}
  ) {
    return this.repo.findOneByIdOrThrowError(catId, options);
  }

  public async findOne(options: FindOptions = {}) {
    return this.repo.findOne(options);
  }

  public async getAll(options: FindAndCountOptions = {}) {
    return this.repo.findAndCountAll(options);
  }

  public async buLkCreate(data: IOrderItem[], options: BulkCreateOptions) {
    return this.orderItemrepo.bulkCreate(data, options);
  }

  public validateCreateOrder(data: IOrder) {
    const schema = Joi.object({
      firstName: Joi.string().trim().max(50).min(1).required(),
      lastName: Joi.string().trim().max(50).min(1).required(),
      email: Joi.string().max(255).email().required(),
      phoneNumber: Joi.string()
        .regex(PHONE_NUMBER_VALIDATION)
        .required()
        .messages({
          "string.base": "phoneNumber must be a string.",
          "string.empty": "phoneNumber cannot be empty.",
          "string.pattern.base": "Please enter a valid Phone Number.",
          "any.required": "phoneNumber is required and cannot be null.",
        }),
      totalAmount: Joi.number().required(),
      userId: Joi.string().uuid().required(),
      shippingAddress: Joi.string().trim().max(500).min(1).required(),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateUpdate(data: Partial<ICategory>) {
    const schema = Joi.object({
      image: Joi.string()
        .trim()
        .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
        .messages({
          "string.base": "Image must be a string.",
          "string.pattern.base":
            "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
        })
        .allow(null, ""),

      name: Joi.string().trim().max(255).messages({
        "string.base": "name must be a string.",
        "string.max": "name cannot exceed 255 characters.",
      }),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateGetAllQuery(query: { search?: any; storeIds?: any }) {
    const schema = Joi.object({
      search: Joi.string().trim().max(255).allow("").messages({
        "string.base": "Search term must be a string.",
        "string.max": "Search term cannot exceed 255 characters.",
      }),
    });

    const { error } = schema.validate(query);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }
}

export default OrderService;
