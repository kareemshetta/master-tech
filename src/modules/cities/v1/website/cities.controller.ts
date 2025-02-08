import { Op } from "sequelize";
import { AppError } from "../../../../utils/appError";
import { ICity } from "../../../../utils/shared.types";
import CityService from "./cities.service";
import { Request } from "express";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import sequelize from "../../../../config/db/config";
export class CityController {
  private static instance: CityController | null = null;
  private service: CityService;

  private constructor() {
    this.service = CityService.getInstance();
  }

  public static getInstance(): CityController {
    if (!CityController.instance) {
      CityController.instance = new CityController();
    }
    return CityController.instance;
  }

  public async create(req: Request) {
    const storeData: ICity = req.body;

    // Validate the incoming data
    this.service.validateCreate(storeData);

    const foundOneWithSameName = await this.service.findOne({
      where: { name: storeData.name },
    });
    if (foundOneWithSameName) {
      throw new AppError("entityWithNameExist", 409);
    }

    // Create the city
    const city = await this.service.create(storeData);

    return city;
  }

  public async update(req: Request) {
    const { id } = req.params;
    const updateData: Partial<ICity> = req.body;

    // Validate the update data
    this.service.validateUpdate(updateData);

    if (updateData.name) {
      const foundOneWithSameName = await this.service.findOne({
        where: { name: updateData.name, id: { [Op.ne]: id } },
      });
      if (foundOneWithSameName) {
        throw new AppError("entityWithNameExist", 409);
      }
    }

    // Find the city first
    const city = await this.service.findOneByIdOrThrowError(id);

    // Update the city
    const updatedCat = await city.update(updateData);

    return updatedCat;
  }

  public async delete(req: Request) {
    const { id } = req.params;

    // Delete the city
    return this.service.delete(id);
  }

  public async getStore(req: Request) {
    const { id } = req.params;
    const lng = req.language;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    const city = await this.service.findOneByIdOrThrowError(id, {
      attributes: ["id", [sequelize.col(`cities."${nameColumn}"`), "name"]],
    });

    return city;
  }

  public async getAllStores(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search } = req.query;
    const lng = req.language;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    this.service.validateGetAllStoresQuery({ search });
    const options: any = {
      attributes: ["id", [sequelize.col(`cities."${nameColumn}"`), "name"]],
      offset,
      limit,
      order: [[orderBy, order]],
      where: {},
    };

    if (search) {
      search = search.toString().replace(/\+/g, "").trim();
      options.where = sequelize.where(
        sequelize.fn("LOWER", sequelize.col(`cities."${nameColumn}"`)),
        {
          [Op.like]: `%${search.toLowerCase()}%`,
        }
      );
    }

    const date = await this.service.getAll(options);

    return date;
  }
}
