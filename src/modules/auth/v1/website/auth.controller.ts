import { ICart, Iuser } from "../../../../utils/shared.types";

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

export class AuthController {
  private static instance: AuthController | null = null;
  private service: UserService;

  private constructor() {
    this.service = UserService.getInstance();
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

    this.service.validateLoginUser(body);
    const found: Iuser | undefined = (
      await this.service.findOne({
        where: { email: body.email?.toLowerCase() },
        attributes: { exclude: ["updatedAt", "role"] },
        include: [{ model: Cart, attributes: ["id"] }],
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
    const { id } = req.params;
    // Implementation commented out in original code
  }

  async getOne(req: any) {
    const { id } = req.user;
    validateUUID(id, "invalid user id");

    return this.service.findOneByIdOrThrowError(id, {
      attributes: {
        exclude: ["deletedAt", "updatedAt", "password"],
      },
    });
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
