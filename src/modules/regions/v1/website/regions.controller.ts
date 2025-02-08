import { Op } from "sequelize";
import { AppError } from "../../../../utils/appError";
import { IRegion } from "../../../../utils/shared.types";
import RegionService from "./regions.service";
import { Request } from "express";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import sequelize from "../../../../config/db/config";
import CityService from "../../../cities/v1/dashboard/cities.service";
import { validateUUID } from "../../../../utils/generalFunctions";
import City from "../../../../models/cities.model";
export class RegionController {
  private static instance: RegionController | null = null;
  private service: RegionService;
  private cityService: CityService;

  private constructor() {
    this.service = RegionService.getInstance();
    this.cityService = CityService.getInstance();
  }

  public static getInstance(): RegionController {
    if (!RegionController.instance) {
      RegionController.instance = new RegionController();
    }
    return RegionController.instance;
  }

  public async create(req: Request) {
    const storeData: IRegion = req.body;

    // Validate the incoming data
    this.service.validateCreate(storeData);

    await this.cityService.findOneByIdOrThrowError(storeData.cityId!);

    const foundOneWithSameName = await this.service.findOne({
      where: { name: storeData.name },
    });
    if (foundOneWithSameName) {
      throw new AppError("entityWithNameExist", 409);
    }

    // Create the region
    const region = await this.service.create(storeData);

    return region;
  }

  public async update(req: Request) {
    const { id } = req.params;
    const updateData: Partial<IRegion> = req.body;

    // Validate the update data
    this.service.validateUpdate(updateData);

    if (updateData.cityId) {
      await this.cityService.findOneByIdOrThrowError(updateData.cityId!);
    }

    if (updateData.name) {
      const foundOneWithSameName = await this.service.findOne({
        where: { name: updateData.name, id: { [Op.ne]: id } },
      });
      if (foundOneWithSameName) {
        throw new AppError("entityWithNameExist", 409);
      }
    }

    // Find the region first
    const region = await this.service.findOneByIdOrThrowError(id);

    // Update the region
    const updatedCat = await region.update(updateData);

    return updatedCat;
  }

  public async delete(req: Request) {
    const { id } = req.params;

    // Delete the region
    return this.service.delete(id);
  }

  public async getOne(req: Request) {
    const { id } = req.params;
    const lng = req.language;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    const region = await this.service.findOneByIdOrThrowError(id, {
      attributes: [
        "id",
        [sequelize.col(`regions."${nameColumn}"`), "name"],
        "cityId",
      ],
      include: [
        {
          model: City,
          attributes: ["id", [sequelize.col(`"${nameColumn}"`), "name"]],
        },
      ],
    });

    return region;
  }

  public async getAllStores(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    console.log("language", req.language);
    let { search, cityId } = req.query;
    const lng = req.language;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    this.service.validateGetAllStoresQuery({ search });
    const options: any = {
      attributes: [
        "id",
        [sequelize.col(`regions."${nameColumn}"`), "name"],
        "cityId",
      ],
      include: [
        {
          model: City,
          attributes: ["id", [sequelize.col(`"${nameColumn}"`), "name"]],
        },
      ],
      offset,
      limit,
      order: [[orderBy, order]],
      where: {},
    };

    if (cityId) {
      cityId = cityId.toString();
      validateUUID(cityId, "invalid city id");
      options.where.cityId = cityId;
    }
    if (search) {
      search = search.toString().replace(/\+/g, "").trim();
      options.where.name = {
        [Op.or]: [
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col(`regions."${nameColumn}"`)),
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
