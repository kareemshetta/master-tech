import { Op } from "sequelize";
import { AppError } from "../../../../utils/appError";
import { IBrand } from "../../../../utils/shared.types";
import BrandService from "./brands.service";
import { Request } from "express";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import sequelize from "../../../../config/db/config";
export class BrandController {
  private static instance: BrandController | null = null;
  private service: BrandService;

  private constructor() {
    this.service = BrandService.getInstance();
  }

  public static getInstance(): BrandController {
    if (!BrandController.instance) {
      BrandController.instance = new BrandController();
    }
    return BrandController.instance;
  }

  public async create(req: Request) {
    const storeData: IBrand = req.body;

    // Validate the incoming data
    this.service.validateCreate(storeData);

    const foundOneWithSameName = await this.service.findOne({
      where: { name: storeData.name },
    });
    if (foundOneWithSameName) {
      throw new AppError("entityWithNameExist", 409);
    }
    const foundOneWithSameNameAr = await this.service.findOne({
      where: { name: storeData.nameAr },
    });
    if (foundOneWithSameNameAr) {
      throw new AppError("entityWithNameExist", 409);
    }

    // Create the brand
    const brand = await this.service.create(storeData);

    return brand;
  }

  public async update(req: Request) {
    const { id } = req.params;
    const updateData: Partial<IBrand> = req.body;

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
    if (updateData.nameAr) {
      const foundOneWithSameName = await this.service.findOne({
        where: { name: updateData.nameAr, id: { [Op.ne]: id } },
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

    // Delete the brand
    return this.service.delete(id);
  }

  public async getStore(req: Request) {
    const { id } = req.params;

    const brand = await this.service.findOneByIdOrThrowError(id, {
      attributes: ["id", "name", "nameAr", "image"],
    });

    return brand;
  }

  public async getAllStores(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search } = req.query;
    const lng = req.language;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    this.service.validateGetAllQuery({ search });
    const options: any = {
      attributes: [
        "id",
        [sequelize.col(`brands."${nameColumn}"`), "name"],
        "image",
      ],
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
            sequelize.fn("LOWER", sequelize.col(`brands."${nameColumn}"`)),
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
