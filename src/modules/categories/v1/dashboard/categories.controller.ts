import { Op } from "sequelize";
import { AppError } from "../../../../utils/appError";
import { ICategory } from "../../../../utils/shared.types";
import CategoryService from "./categories.service";
import { Request } from "express";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import sequelize from "../../../../config/db/config";
export class CategoryController {
  private static instance: CategoryController | null = null;
  private catService: CategoryService;

  private constructor() {
    this.catService = CategoryService.getInstance();
  }

  public static getInstance(): CategoryController {
    if (!CategoryController.instance) {
      CategoryController.instance = new CategoryController();
    }
    return CategoryController.instance;
  }

  public async create(req: Request) {
    const storeData: ICategory = req.body;

    // Validate the incoming data
    this.catService.validateCreate(storeData);

    const foundOneWithSameName = await this.catService.findOne({
      where: { name: storeData.name },
    });
    if (foundOneWithSameName) {
      throw new AppError("entityWithNameExist", 409);
    }

    // Create the cat
    const cat = await this.catService.create(storeData);

    return cat;
  }

  public async update(req: Request) {
    const { id } = req.params;
    const updateData: Partial<ICategory> = req.body;

    // Validate the update data
    this.catService.validateUpdate(updateData);

    if (updateData.name) {
      const foundOneWithSameName = await this.catService.findOne({
        where: { name: updateData.name, id: { [Op.ne]: id } },
      });
      if (foundOneWithSameName) {
        throw new AppError("entityWithNameExist", 409);
      }
    }

    // Find the cat first
    const cat = await this.catService.findOneByIdOrThrowError(id);

    // Update the cat
    const updatedCat = await cat.update(updateData);

    return updatedCat;
  }

  public async delete(req: Request) {
    const { id } = req.params;

    // Delete the cat
    return this.catService.delete(id);
  }

  public async getStore(req: Request) {
    const { id } = req.params;

    const cat = await this.catService.findOneByIdOrThrowError(id, {});

    return cat;
  }

  public async getAllStores(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search } = req.query;
    this.catService.validateGetAllStoresQuery({ search });
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
            sequelize.fn("LOWER", sequelize.col("categories.name")),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col(`categories."description"`)),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
        ],
      };
    }

    const date = await this.catService.getAll(options);

    return date;
  }
}
