import {
  ICart,
  ICartItem,
  IProduct,
  ISku,
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
import { CategoryType } from "../../../../utils/enums";
import ProductSkuRepository from "../../../products/v1/product.sku.repository";
export class CartController {
  private static instance: CartController | null = null;
  private cartService: CartService;
  private productService: PrdouctService;
  private productSkuRepo: ProductSkuRepository;

  private constructor() {
    this.cartService = CartService.getInstance();
    this.productService = PrdouctService.getInstance();
    this.productSkuRepo = ProductSkuRepository.getInstance();
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
        attributes: ["id", "storeId", "categoryType", "quantity"],
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
            limit: 1,
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

    const cartItem: any = await this.cartService.findOne({
      attributes: ["id", "quantity", "price", "skuId"],
      where: { cartId: cart?.id, productId: storeData.productId },
    });
    // check if the product exists on the cart

    if (!cartItem) {
      if (cartProduct.categoryType == CategoryType.ACCESSORY) {
        if (!cartItem && cartProduct.quantity! < storeData.quantity!) {
          throw new AppError("productQuantityLessThanOrder", 409);
        }
      }

      if (cartProduct.categoryType == CategoryType.LAPTOP) {
        const sku = (await this.productSkuRepo.findOneByIdOrThrowError(
          storeData.skuId!
        )) as ISku;
        if (sku.quantity! < storeData.quantity!) {
          throw new AppError("productQuantityLessThanOrder", 409);
        }
      }
      // Create the cat
      const cat = await this.cartService.createCartItem(storeData);

      return cat;
    } else {
      if (cartProduct.categoryType == CategoryType.ACCESSORY) {
        if (cartItem.quantity! + storeData.quantity! > cartProduct.quantity!) {
          throw new AppError("productQuantityLessThanOrder", 409);
        }

        const updatedCat = await cartItem.update({
          quantity: cartItem.quantity! + storeData.quantity!,
        });
        return updatedCat;
      }

      if (cartProduct.categoryType == CategoryType.LAPTOP) {
        const sku = (await this.productSkuRepo.findOneByIdOrThrowError(
          storeData.skuId!
        )) as ISku;
        if (cartItem.quantity! + storeData.quantity! > sku.quantity!) {
          throw new AppError("productQuantityLessThanOrder", 409);
        }
        const updatedCat = await cartItem.update({
          quantity: cartItem.quantity! + storeData.quantity!,
        });
        return updatedCat;
      }
    }
  }

  public async update(req: Request) {
    const { id } = req.params;
    const updateData: Partial<ICartItem> = req.body;

    // Validate the update data
    this.cartService.validateUpdateItem({ ...updateData, id });

    // Find the cat first
    const cat: any = await this.cartService.findOneByIdOrThrowError(id, {
      include: {
        model: Product,
        attributes: ["id", "categoryType", "quantity"],
      },
    });

    // console.log("cat", cat.Product.dataValues);

    if (
      cat.Product.dataValues.categoryType == CategoryType.ACCESSORY &&
      cat.Product.dataValues.quantity! < updateData.quantity!
    ) {
      throw new AppError("productQuantityLessThanOrder", 422);
    }

    if (cat.Product.dataValues.categoryType == CategoryType.LAPTOP) {
      const sku = (await this.productSkuRepo.findOneByIdOrThrowError(
        cat.skuId!
      )) as ISku;
      if (sku.quantity! < updateData.quantity!) {
        throw new AppError("productQuantityLessThanOrder", 422);
      }
    }

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
            order: [["createdAt", "ASC"]],
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
