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
import City from "../../../../models/cities.model";
import Region from "../../../../models/regions.model";

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
          attributes: ["id", "name", "phoneNumber"],
          as: "subStores",
        },
        {
          model: Store,
          attributes: ["id", "name", "phoneNumber"],
          as: "parentStore",
        },

        {
          model: City,
          attributes: ["id", "name"],
        },
        {
          model: Region,
          attributes: ["id", "name"],
        },
      ],
    });

    return store;
  }

  public async getAllStores(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search, storeIds, cityId, regionId } = req.query;
    this.storeService.validateGetAllStoresQuery({
      search,
      storeIds,
      cityId,
      regionId,
    });
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
    if (cityId) {
      options.where.cityId = cityId;
    }
    if (regionId) {
      options.where.regionId = regionId;
    }
    const date = await this.storeService.getAll(options);

    return date;
  }
}

export default StoreController;
