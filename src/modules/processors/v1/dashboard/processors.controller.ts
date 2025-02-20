import { Op } from "sequelize";
import { AppError } from "../../../../utils/appError";
import { IProcessor } from "../../../../utils/shared.types";

import { Request } from "express";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import sequelize from "../../../../config/db/config";
import ProcessorService from "./processors.service";
import PrdouctService from "../../../products/v1/dashboard/products.service";
import { validateUUID } from "../../../../utils/generalFunctions";
export class ProcessorController {
  private static instance: ProcessorController | null = null;
  private service: ProcessorService;
  private productService: PrdouctService;

  private constructor() {
    this.service = ProcessorService.getInstance();
    this.productService = PrdouctService.getInstance();
  }

  public static getInstance(): ProcessorController {
    if (!ProcessorController.instance) {
      ProcessorController.instance = new ProcessorController();
    }
    return ProcessorController.instance;
  }

  public async create(req: Request) {
    const storeData: IProcessor = req.body;

    // Validate the incoming data
    this.service.validateCreateOrUpdate(storeData);

    const foundOneWithSameName = await this.service.findOne({
      where: { type: storeData.type },
    });
    if (foundOneWithSameName) {
      throw new AppError("entityWithNameExist", 409);
    }

    // Create the brand
    const processor = await this.service.create(storeData);

    return processor;
  }

  public async update(req: Request) {
    const { id } = req.params;
    const updateData: Partial<IProcessor> = req.body;

    // Validate the update data
    this.service.validateCreateOrUpdate(updateData);

    if (updateData.type) {
      const foundOneWithSameName = await this.service.findOne({
        where: { type: updateData.type, id: { [Op.ne]: id } },
      });
      if (foundOneWithSameName) {
        throw new AppError("entityWithNameExist", 409);
      }
    }

    // Find the brand first
    const brand = await this.service.findOneByIdOrThrowError(id);

    // Update the brand
    const updated = await brand.update(updateData);

    return updated;
  }

  public async delete(req: Request) {
    const { id } = req.params;
    validateUUID(id, "invalid processor id");
    await this.service.findOneByIdOrThrowError(id);

    const count = await this.productService.count({
      where: { processorId: id },
    });
    if (count > 0) {
      throw new AppError("processError", 403);
    }
    // Delete the brand
    return this.service.delete(id);
  }

  public async get(req: Request) {
    const { id } = req.params;

    const brand = await this.service.findOneByIdOrThrowError(id, {
      attributes: ["id", "type"],
    });

    return brand;
  }

  public async getAll(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search } = req.query;
    const lng = req.language;

    this.service.validateGetAllStoresQuery({ search });
    const options: any = {
      attributes: ["id", "type"],
      offset,
      limit,
      order: [[orderBy, order]],
      where: {},
    };

    if (search) {
      search = search.toString().replace(/\+/g, "").trim();
      options.where.type = {
        [Op.or]: [
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col(`type`)),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
        ],
      };
    }

    const date = await this.service.getAll(options);

    return date;
  }
}
