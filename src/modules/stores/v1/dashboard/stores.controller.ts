import { date } from "joi";
import { Request, Response, NextFunction } from "express";
import { StoreService } from "./stores.service";
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

  public async createStore(req: Request) {
    const storeData: IStore = req.body;

    // Validate the incoming data
    this.storeService.validateCreateStore(storeData);

    const foundOneWithSameName = await this.storeService.findOne({
      where: { name: storeData.name },
    });
    if (foundOneWithSameName) {
      throw new AppError("entityWithNameExist", 409);
    }

    const foundOneWithSamePhone = await this.storeService.findOne({
      where: { phoneNumber: storeData.phoneNumber },
    });
    if (foundOneWithSamePhone) {
      throw new AppError("entityWithPhoneExist", 409);
    }

    // Create the store
    const store = await this.storeService.create(storeData);

    return store;
  }

  public async updateStore(req: Request) {
    const { id } = req.params;
    const updateData: Partial<IStore> = req.body;

    // Validate the update data
    this.storeService.validateUpdateStore(updateData);

    if (updateData.name) {
      const foundOneWithSameName = await this.storeService.findOne({
        where: { name: updateData.name, id: { [Op.ne]: id } },
      });
      if (foundOneWithSameName) {
        throw new AppError("entityWithNameExist", 409);
      }
    }
    if (updateData.phoneNumber) {
      const foundOneWithSamePhone = await this.storeService.findOne({
        where: { phoneNumber: updateData.phoneNumber, id: { [Op.ne]: id } },
      });
      if (foundOneWithSamePhone) {
        throw new AppError("entityWithPhoneExist", 409);
      }
    }

    // Find the store first
    const store = await this.storeService.findOneByIdOrThrowError(id);

    // Update the store
    const updatedStore = await store.update(updateData);

    return updatedStore;
  }

  public async deleteStore(req: Request) {
    const { id } = req.params;

    // Delete the store
    return this.storeService.delete(id);
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
