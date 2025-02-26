import { ICart, IStore, Iuser } from "../../../../utils/shared.types";

import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import {
  comparePassword,
  generateSecureOTP,
  generateToken,
  hashPassword,
  isNowGreaterThanBy15Minutes,
  validateUUID,
} from "../../../../utils/generalFunctions";
import { Request, Response } from "express";
import { Op, Transaction } from "sequelize";
import sequelize from "../../../../config/db/config";

import { AppError } from "../../../../utils/appError";
import UserService from "../../../users/v1/dashboard/users.service";
import { date } from "joi";
import { sendEmail } from "../../../../utils/communication-functions";
import Cart from "../../../../models/carts.model";
import CartItem from "../../../../models/cartItem.model";
import Product from "../../../../models/products.model";
import { ProductSku } from "../../../../models/product_skus.model";
import ProductAttribute from "../../../../models/product_attributes.model";
import Store from "../../../../models/stores.model";
import Category from "../../../../models/categories.model";
import Review from "../../../../models/review.model";
import StoreService from "../../../stores/v1/dashboard/stores.service";

export class AuthController {
  private static instance: AuthController | null = null;
  private service: UserService;
  private StoreService: StoreService;

  private constructor() {
    this.service = UserService.getInstance();
    this.StoreService = StoreService.getInstance();
  }

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  async getAll(req: any) {
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    return this.service.getAll({
      attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
      offset,
      limit,
      order: [[orderBy, order]],
    });
  }

  async signUp(req: Request) {
    let t: Transaction | null = null;
    try {
      t = await sequelize.transaction();

      const body = req.body as Iuser;

      this.service.validateCreateUser(body);
      const found = await this.service.findOne({
        where: { email: body.email?.toLowerCase() },
      });

      if (found) {
        throw new AppError("entityWithEmialExist", 409);
      }
      const data: Iuser = (
        await this.service.create(body, { transaction: t })
      ).toJSON();

      const cart = (
        await this.service.createCart(data.id!, { transaction: t })
      ).toJSON() as ICart;
      const token = generateToken({
        id: data.id,
        email: data.email,
        role: data.role,
      });

      delete data.password;
      await t.commit();
      return { data, token, cartId: cart.id };
    } catch (e) {
      console.log(e);
      if (t) await t.rollback();
      throw e;
    }
  }

  async login(req: Request) {
    const body = req.body as Iuser;
    const lng = req.language;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
    this.service.validateLoginUser(body);
    const found: Iuser | undefined = (
      await this.service.findOne({
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
            model: Product,
            attributes: [
              "id",
              [sequelize.col(`"${nameColumn}"`), "name"],
              [sequelize.col(`"${descriptionColumn}"`), "description"],
              "categoryType",
            ],
            through: { attributes: [] },
          },
          {
            model: Cart,
            attributes: ["id"],
            include: [
              {
                model: CartItem,
                attributes: ["id", "quantity", "price"],
                include: [
                  {
                    model: Product,
                    attributes: [
                      "id",
                      [sequelize.col(`"${nameColumn}"`), "name"],
                      [sequelize.col(`"${descriptionColumn}"`), "description"],
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
          },
        ],
      })
    )?.toJSON();

    if (!found) {
      throw new AppError("wrongCredentials", 401);
    }

    const isTruePassword = await comparePassword(
      body.password!,
      found.password
    );
    if (!isTruePassword) throw new AppError("wrongCredentials", 401);

    const token = generateToken({
      id: found.id,
      email: found.email,
      role: found.role,
      cartId: found.cart?.id,
    });
    delete found.password;

    return { date: found, token };
  }

  async update(req: any) {
    const { id } = req.user;
    const body = req.body as Iuser;

    this.service.validateUpdateUser(body);
    const found = await this.service.findOne({
      where: { email: body.email?.toLowerCase(), id: { [Op.ne]: id } },
    });

    if (found) {
      throw new AppError("entityWithEmialExist", 409);
    }

    const user = await this.service.findOneByIdOrThrowError(id);
    const updated = (
      await user.update(body, {
        returning: ["email", "firstName", "lastName", "phoneNumber", "image"],
      })
    ).toJSON() as Iuser;

    delete updated.password;
    delete updated.role;
    delete updated.passwordChangedAt;
    delete updated.otp;
    delete updated.otpCreatedAt;
    delete updated.status;
    delete updated.deletedAt;
    return updated;

    // Implementation commented out in original code
  }

  async getOne(req: any) {
    const { id } = req.user;
    validateUUID(id, "invalid user id");
    const lng = req.language;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
    const user = (
      await this.service.findOneByIdOrThrowError(id, {
        logging: console.log,
        attributes: {
          exclude: ["deletedAt", "updatedAt", "password"],
        },
        include: [
          {
            model: Product,
            attributes: [
              "id",
              [sequelize.col(`"${nameColumn}"`), "name"],
              [sequelize.col(`"${descriptionColumn}"`), "description"],
              "image",
              "discount",
              "basePrice",
              "categoryType",
              [
                sequelize.literal(
                  'ROUND(CAST("Products"."basePrice" AS DECIMAL) * (1 - (CAST("Products"."discount" AS DECIMAL) / 100)), 2)'
                ),
                "priceAfterDiscount",
              ],
              [
                sequelize.literal(`
                ROUND(COALESCE(
                  (SELECT AVG(rating) FROM "reviews" WHERE "reviews"."productId" = "Products"."id"
                ), 0), 2)
              `),
                "averageRating",
              ],
              [
                sequelize.literal(`
                EXISTS (
                  SELECT 1 FROM "userFavorites" AS "favorites"
                  WHERE "favorites"."productId" = "Products"."id" 
                  AND "favorites"."userId" = '${id}' AND "favorites"."deletedAt" IS NULL
                )
              `),
                "isFavourite",
              ],
            ],
            include: [
              {
                model: Store,
                attributes: [
                  "id",
                  [sequelize.col(`"${nameColumn}"`), "name"],

                  "image",
                ],
                as: "store",
              },
              {
                model: Category,
                attributes: ["id", [sequelize.col(`"${nameColumn}"`), "name"]],
                as: "category",
              },
            ],
            through: { attributes: [] },
          },
          // {
          //   model: Cart,
          //   attributes: [
          //     "id",
          //     [
          //       sequelize.literal(`
          //       COALESCE(
          //           (
          //               SELECT SUM(CAST("CartItems"."quantity" AS DECIMAL) * CAST("CartItems"."price" AS DECIMAL))
          //               FROM "cart_items" AS "CartItems"
          //               WHERE "CartItems"."cartId" = "cart"."id"
          //               AND "CartItems"."deletedAt" IS NULL
          //           ), 0
          //       )
          //   `),
          //       "totalPrice",
          //     ],
          //   ],
          //   include: [
          //     {
          //       model: CartItem,
          //       attributes: ["id", "quantity", "price"],
          //       include: [
          //         {
          //           model: Product,
          //           attributes: [
          //             "id",
          //             [sequelize.col(`"${nameColumn}"`), "name"],
          //             [sequelize.col(`"${descriptionColumn}"`), "description"],
          //             "storeId",
          //           ],
          //         },
          //         {
          //           model: ProductSku,
          //           attributes: ["sku", "price"],
          //           include: [
          //             {
          //               model: ProductAttribute,
          //               attributes: ["type", "value"],
          //               as: "color",
          //             },
          //             {
          //               model: ProductAttribute,
          //               attributes: ["type", "value"],
          //               as: "storage",
          //             },
          //           ],
          //         },
          //       ],
          //     },
          //   ],
          // },
        ],
      })
    ).toJSON() as Iuser;
    if (
      user &&
      user.cart &&
      user.cart.cart_items &&
      user.cart.cart_items.length > 0
    ) {
      const cartStoreId = user.cart.cart_items[0].Product!.storeId;
      const store = await this.StoreService.findOne({
        where: { id: cartStoreId },
        attributes: ["id", "allowShipping", "image"],
      });
      if (store) {
        user.cart.store = store.toJSON() as IStore;
      }
    }
    return user;
  }

  async getOtp(req: any) {
    const body = req.body as Iuser;

    this.service.validateEmail(body.email!);
    const found = await this.service.findOne({
      where: { email: body.email?.toLowerCase() },
      attributes: { exclude: ["updatedAt", "role"] },
    });

    if (!found) {
      throw new AppError("wrongCredentials", 401);
    }
    const otp = generateSecureOTP();
    await found.update({ otp, otpCreatedAt: new Date() });
    sendEmail(
      [body.email!],
      "otp",
      `<p>your otp ${otp} which is valid for 15 seconds`
    );

    return "you will recieve an email with otp shortly";
  }

  async verifyOtp(req: any) {
    const body = req.body as Iuser;
    this.service.validateVerifyOtp(body);
    const found = (
      await this.service.findOne({
        where: { email: body.email?.toLowerCase() },
        attributes: ["email", "otp", "otpCreatedAt"],
      })
    )?.toJSON() as Iuser;
    if (!found) {
      throw new AppError("wrongCredentials", 401);
    }
    console.log(
      found.otp,
      body.otp,
      isNowGreaterThanBy15Minutes(new Date(found.otpCreatedAt!))
    );
    if (found.otp != body.otp) {
      throw new AppError("wrongOtp", 401);
    }

    if (isNowGreaterThanBy15Minutes(new Date(found.otpCreatedAt!))) {
      throw new AppError("otpExpired", 401);
    }

    return "yourOtpHavePassedSuccess";
  }

  async updatePassword(req: any) {
    const body = req.body as Iuser;
    this.service.validateUpdatePassword(body);
    const found = await this.service.findOne({
      where: { email: body.email?.toLowerCase() },
      attributes: ["email", "otp", "otpCreatedAt"],
    });
    const foundJson = found?.toJSON() as Iuser;
    if (!found) {
      throw new AppError("wrongCredentials", 401);
    }

    if (foundJson.otp != body.otp) {
      throw new AppError("wrongOtp", 401);
    }

    if (isNowGreaterThanBy15Minutes(new Date(foundJson.otpCreatedAt!))) {
      throw new AppError("otpExpired", 401);
    }
    const password = await hashPassword(body.password!);
    const updated = await this.service.updateOne(
      { password: password, otp: null, otpCreatedAt: null },
      { where: { email: body.email?.toLowerCase() } }
    );

    return updated;
  }
  async deleteOne(req: any) {
    const { id } = req.params;
    validateUUID(id, "invalid trainer id");
    return this.service.delete(id);
  }
}

export default AuthController;
