import { PrdouctService } from "./../../../products/v1/dashboard/products.service";
import { col, fn, Op, where } from "sequelize";
import { AppError } from "../../../../utils/appError";
import { IContactUs } from "../../../../utils/shared.types";
import e, { Request } from "express";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import sequelize from "../../../../config/db/config";
import { validateUUID } from "../../../../utils/generalFunctions";

import User from "../../../../models/users.model";
import ContactusService from "./contact-us.service";

export class ContactusController {
  private static instance: ContactusController | null = null;
  private service: ContactusService;

  private constructor() {
    this.service = ContactusService.getInstance();
  }

  public static getInstance(): ContactusController {
    if (!ContactusController.instance) {
      ContactusController.instance = new ContactusController();
    }
    return ContactusController.instance;
  }

  public async create(req: Request) {
    const storeData: IContactUs = req.body;

    this.service.validateCreate(storeData);

    // Create the city
    const review = await this.service.create(storeData);

    return review;
  }

  public async delete(req: Request) {
    const { id } = req.params;

    const found = await this.service.findOneByIdOrThrowError(id, {
      attributes: ["id", "contactType"],
    });

    // Delete the city
    return this.service.delete(id);
  }

  public async get(req: Request) {
    const { id } = req.params;
    validateUUID(id, "invalid contactus id");
    const city = await this.service.findOneByIdOrThrowError(id, {
      attributes: { exclude: ["deletedAt", "updatedAt"] },
    });

    return city;
  }

  public async getAll(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search } = req.query;

    this.service.validateGetAllStoresQuery({ search });
    const options: any = {
      attributes: { exclude: ["deletedAt", "updatedAt"] },

      offset,
      limit,
      order: [[orderBy, order]],
      where: {},
    };

    if (search) {
      search = search.toString().replace(/\+/g, "").trim();
      options.where.name = {
        [Op.or]: [
          sequelize.where(
            sequelize.fn("LOWER", sequelize.literal(`"contactus"."firstName"`)),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.literal(`"contactus"."lastName"`)),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.literal(`"contactus"."email"`)),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.literal(`"contactus"."message"`)),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
        ],
      };
    }
    return this.service.getAll(options);
  }
}
