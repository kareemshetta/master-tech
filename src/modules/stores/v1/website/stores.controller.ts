import { date } from "joi";
import { Request, Response, NextFunction } from "express";
import { StoreService } from "./../dashboard/stores.service";
import { IStore } from "../../../../utils/shared.types";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import { AppError } from "../../../../utils/appError";
import { FindOptions, Op } from "sequelize";
import Store from "../../../../models/stores.model";
import User from "../../../../models/users.model";
import sequelize from "../../../../config/db/config";

export class StoreController {
  private static instance: StoreController | null = null;
  private storeService: StoreService;

  private constructor() {
    this.storeService = StoreService.getInstance();
  }

  public static getInstance(): StoreController {
    if (!StoreController.instance) {
      StoreController.instance = new StoreController();
    }
    return StoreController.instance;
  }

  public async getStore(req: Request) {
    const { id } = req.params;

    const store = await this.storeService.findOneByIdOrThrowError(id, {
      include: [
        {
          model: Store,
          attributes: ["id", "name", "phoneNumber", "location"],
          as: "subStores",
        },
        {
          model: Store,
          attributes: ["id", "name", "phoneNumber", "location"],
          as: "parentStore",
        },
      ],
    });

    return store;
  }

  public async getAllStores(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search, storeIds } = req.query;
    this.storeService.validateGetAllStoresQuery({ search, storeIds });
    const options: any = {
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
            sequelize.fn("LOWER", sequelize.col("stores.name")),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col(`stores."phoneNumber"`)),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
        ],
      };
    }

    if (storeIds) {
      storeIds = storeIds.toString().split(",");
      options.where.parentId = { [Op.in]: storeIds };
    }

    const date = await this.storeService.getAll(options);

    return date;
  }
}

export default StoreController;
