import { IAdmin } from "../../../../utils/shared.types";

import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import {
  comparePassword,
  generateToken,
  validateUUID,
} from "../../../../utils/generalFunctions";
import { Request, Response } from "express";

import { AppError } from "../../../../utils/appError";

import AdminService from "../../../admins/v1/dashboard/admins.service";

export class AuthController {
  private static instance: AuthController | null = null;
  private service: AdminService;

  private constructor() {
    this.service = AdminService.getInstance();
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
    const body = req.body as IAdmin;

    this.service.validateCreateAdmin(body);
    const found = await this.service.findOne({
      where: { email: body.email?.toLowerCase() },
    });

    if (found) {
      throw new AppError("entityWithEmialExist", 409);
    }
    const data: IAdmin = (await this.service.create(body)).toJSON();
    const token = generateToken({
      id: data.id,
      email: data.email,
      role: data.role,
    });

    delete data.password;
    return { data, token };
  }

  async login(req: Request) {
    const body = req.body as IAdmin;

    this.service.validateLoginAdmin(body);
    const found: IAdmin | undefined = (
      await this.service.findOne({
        where: { email: body.email?.toLowerCase() },
        attributes: { exclude: ["updatedAt", "role"] },
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

  async deleteOne(req: any) {
    const { id } = req.params;
    validateUUID(id, "invalid trainer id");
    return this.service.delete(id);
  }
}

export default AuthController;
