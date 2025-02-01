import { Iuser } from "../../../../utils/shared.types";

import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import { validateUUID } from "../../../../utils/generalFunctions";
import { Request, Response } from "express";
import { Op } from "sequelize";
import sequelize from "../../../../config/db/config";

import { AppError } from "../../../../utils/appError";
import UserService from "./users.service";

export class UserController {
  private static instance: UserController | null = null;
  private service: UserService;

  private constructor() {
    this.service = UserService.getInstance();
  }

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
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

  async create(req: Request) {
    const body = req.body as Iuser;

    this.service.validateCreateUser(body);
    const found = await this.service.findOne({
      where: { email: body.email?.toLowerCase() },
    });

    if (found) {
      throw new AppError("entityWithEmialExist", 409);
    }
    const data = await this.service.create(body);
    return data;
  }

  async update(req: any) {
    const { id } = req.params;
    // Implementation commented out in original code
  }

  async getOne(req: any) {
    const { id } = req.params;
    validateUUID(id, "invalid user id");

    return this.service.findOneByIdOrThrowError(id, {
      attributes: {
        exclude: ["deletedAt", "updatedAt"],
      },
    });
  }

  async deleteOne(req: any) {
    const { id } = req.params;
    validateUUID(id, "invalid trainer id");
    return this.service.delete(id);
  }
}

export default UserController;
