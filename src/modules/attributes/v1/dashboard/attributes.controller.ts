import { Op } from "sequelize";
import { AppError } from "../../../../utils/appError";
import { IAttributes } from "../../../../utils/shared.types";
import AttributeService from "./attributes.service";
import { Request } from "express";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import sequelize from "../../../../config/db/config";
export class AttributeController {
  private static instance: AttributeController | null = null;
  private attributesService: AttributeService;

  private constructor() {
    this.attributesService = AttributeService.getInstance();
  }

  public static getInstance(): AttributeController {
    if (!AttributeController.instance) {
      AttributeController.instance = new AttributeController();
    }
    return AttributeController.instance;
  }

  public async create(req: Request) {
    const storeData: IAttributes = req.body;

    // Validate the incoming data
    this.attributesService.validateCreate(storeData);

    const foundOneWithSameData = await this.attributesService.findOne({
      where: { type: storeData.type, value: storeData.value?.toLowerCase() },
    });
    if (foundOneWithSameData) {
      throw new AppError("entityWithNameExist", 409);
    }

    // Create the attr
    const attr = await this.attributesService.create(storeData);

    return attr;
  }

  public async update(req: Request) {
    const { id } = req.params;
    const updateData: Partial<IAttributes> = req.body;

    // Validate the update data
    this.attributesService.validateUpdate(updateData);

    const foundOneWithSameName = await this.attributesService.findOne({
      where: {
        type: updateData.type,
        value: updateData.value,
        id: { [Op.ne]: id },
      },
    });
    if (foundOneWithSameName) {
      throw new AppError("entityWithNameExist", 409);
    }

    // Find the attr first
    const attr = await this.attributesService.findOneByIdOrThrowError(id);

    // Update the attr
    const updatedCat = await attr.update(updateData);

    return updatedCat;
  }

  public async delete(req: Request) {
    const { id } = req.params;

    // Delete the attr
    return this.attributesService.delete(id);
  }

  public async getAttribute(req: Request) {
    const { id } = req.params;

    const attr = await this.attributesService.findOneByIdOrThrowError(id, {});

    return attr;
  }

  public async getAllAttributes(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search } = req.query;
    this.attributesService.validateGetAllQuery({ search });
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
            sequelize.fn("LOWER", sequelize.col("product_attributes.type")),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col(`product_attributes."value"`)),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
        ],
      };
    }

    const date = await this.attributesService.getAll(options);

    return date;
  }
}
