import {
  ICart,
  ICartItem,
  IProduct,
  Iuser,
} from "../../../../utils/shared.types";
import CartService from "./carts.service";
import { Request } from "express";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";

import Product from "../../../../models/products.model";
import { ProductSku } from "../../../../models/product_skus.model";
import ProductAttribute from "../../../../models/product_attributes.model";
import CartItem from "../../../../models/cartItem.model";
import PrdouctService from "../../../products/v1/dashboard/products.service";
import { AppError } from "../../../../utils/appError";
import sequelize from "../../../../config/db/config";
import { log } from "console";
import Store from "../../../../models/stores.model";
export class CartController {
  private static instance: CartController | null = null;
  private cartService: CartService;
  private productService: PrdouctService;

  private constructor() {
    this.cartService = CartService.getInstance();
    this.productService = PrdouctService.getInstance();
  }

  public static getInstance(): CartController {
    if (!CartController.instance) {
      CartController.instance = new CartController();
    }
    return CartController.instance;
  }

  public async create(req: Request) {
    const storeData: ICartItem = req.body;
    const { cart } = req.user as Partial<Iuser>;

    storeData.cartId = cart?.id;
    // Validate the incoming data
    this.cartService.validateCreateItem(storeData);
    const cartProduct = (
      await this.productService.findOneByIdOrThrowError(storeData.productId!, {
        attributes: ["id", "storeId"],
      })
    ).toJSON() as IProduct;
    const foundCart = (
      await this.cartService.getCart({
        where: { id: cart?.id },
        include: [
          {
            model: CartItem,
            attributes: ["id"],
            include: [{ model: Product, attributes: ["storeId"] }],
          },
        ],
      })
    )?.toJSON() as ICart;

    if (
      foundCart?.cart_items?.length &&
      foundCart.cart_items[0]?.Product?.storeId !== cartProduct.storeId
    ) {
      throw new AppError("cartItemsMustBeFromSameStore", 403);
    }
    // Create the cat
    const cat = await this.cartService.createCartItem(storeData);

    return cat;
  }

  public async update(req: Request) {
    const { id } = req.params;
    const updateData: Partial<ICartItem> = req.body;

    // Validate the update data
    this.cartService.validateUpdateItem({ ...updateData, id });

    // Find the cat first
    const cat = await this.cartService.findOneByIdOrThrowError(id);

    // Update the cat
    const updatedCat = await cat.update(updateData);

    return updatedCat;
  }

  public async delete(req: Request) {
    const { id } = req.params;
    const cat = await this.cartService.findOneByIdOrThrowError(id);
    // Delete the cat
    return this.cartService.delete(id);
  }

  public async getOne(req: Request) {
    const { id } = req.params;

    const cat = await this.cartService.findOneByIdOrThrowError(id, {
      attributes: ["id", "price", "quantity"],
      include: [
        { model: Product, attributes: ["id", "name", "description"] },
        {
          model: ProductSku,
          attributes: ["sku", "price"],
          include: [
            {
              model: ProductAttribute,
              attributes: ["type", "value"],
              as: "color",
            },
            {
              model: ProductAttribute,
              attributes: ["type", "value"],
              as: "storage",
            },
          ],
        },
      ],
    });

    return cat;
  }

  public async getAll(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);

    const { cart } = req.user as Partial<Iuser>;
    const lng = req.language;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
    const foundCart = (
      await this.cartService.getCart({
        attributes: [
          "id",
          [
            sequelize.literal(`
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
            order: [[orderBy, order]],
            model: CartItem,
            attributes: ["id", "quantity", "price"],
            include: [
              {
                model: Product,
                attributes: [
                  "id",
                  `${nameColumn}`,
                  `${descriptionColumn}`,
                  "image",
                ],
                include: [
                  {
                    model: Store,
                    attributes: ["allowShipping", nameColumn],
                    as: "store",
                  },
                ],
              },
              {
                model: ProductSku,
                attributes: ["sku", "price"],
                include: [
                  {
                    model: ProductAttribute,
                    attributes: ["type", "value"],
                    as: "color",
                  },
                  {
                    model: ProductAttribute,
                    attributes: ["type", "value"],
                    as: "storage",
                  },
                ],
              },
            ],
          },
        ],
      })
    )?.toJSON() as ICart;

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
