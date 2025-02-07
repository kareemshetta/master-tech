import { IAdmin, IProduct } from "../../../../utils/shared.types";

import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import { validateUUID } from "../../../../utils/generalFunctions";
import { Request, Response } from "express";

import { AppError } from "../../../../utils/appError";
import AdminService from "./admins.service";
import StoreService from "../../../stores/v1/dashboard/stores.service";
import { FindAndCountOptions, FindOptions, Op, where } from "sequelize";

export class AdminController {
  private static instance: AdminController | null = null;
  private service: AdminService;
  private storeService: StoreService;

  private constructor() {
    this.service = AdminService.getInstance();
    this.storeService = StoreService.getInstance();
  }

  public static getInstance(): AdminController {
    if (!AdminController.instance) {
      AdminController.instance = new AdminController();
    }
    return AdminController.instance;
  }

  async getAll(req: Request) {
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let storeId = req.user?.storeId;
    let options: Record<string, any> = {
      attributes: ["id", "firstName", "lastName", "email", "phoneNumber"],
      offset,
      limit,
      where: {},
      order: [[orderBy, order]],
    };
    if (req.user?.role != "superAdmin" && storeId)
      options.where!.storeId = storeId;
    return this.service.getAll(options);
  }

  async create(req: Request) {
    const body = req.body as IAdmin;

    this.service.validateCreateAdmin(body);
    const found = await this.service.findOne({
      where: { email: body.email?.toLowerCase() },
    });

    if (found) {
      throw new AppError("entityWithEmialExist", 409);
    }

    const store = await this.storeService.findOneByIdOrThrowError(
      body.storeId!
    );
    const data = (await this.service.create(body)).toJSON() as IAdmin;
    delete data.password;
    return data;
  }

  async update(req: any) {
    const { id } = req.params;
    validateUUID(id, "invalid Admin id");
    const body = req.body as IAdmin;

    this.service.validateUpdateAdmin(body);
    const found = await this.service.findOne({
      where: { email: body.email?.toLowerCase(), id: { [Op.ne]: id } },
    });

    if (found) {
      throw new AppError("entityWithEmialExist", 409);
    }

    const admin = await this.service.findOneByIdOrThrowError(id);
    const updated = (
      await admin.update(body, { returning: true })
    ).toJSON() as IAdmin;

    delete updated.password;
    return updated;
  }

  async getOne(req: any) {
    const { id } = req.params;
    validateUUID(id, "invalid Admin id");

    return this.service.findOneByIdOrThrowError(id, {
      attributes: {
        exclude: ["deletedAt", "updatedAt"],
      },
    });
  }

  async deleteOne(req: any) {
    const { id } = req.params;
    validateUUID(id, "invalid Admin id");
    return this.service.delete(id);
  }
}

export default AdminController;
