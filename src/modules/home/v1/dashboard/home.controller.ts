import { Request } from "express";
import { DataTypes, Op } from "sequelize";
import sequelize from "../../../../config/db/config";
import { AppError } from "../../../../utils/appError";
import HomeService from "./home.service";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import { validateUUID } from "../../../../utils/generalFunctions";
import { IHome } from "../../../../utils/shared.types";

export class HomeController {
  private static instance: HomeController | null = null;
  private service: HomeService;

  private constructor() {
    this.service = HomeService.getInstance();
  }

  public static getInstance(): HomeController {
    if (!HomeController.instance) {
      HomeController.instance = new HomeController();
    }
    return HomeController.instance;
  }

  public async create(req: Request) {
    const homeData: IHome = req.body;

    // Validate the incoming data
    this.service.validateCreate(homeData);

    // Check if a home entry already exists since we typically want only one
    const existingHome = await this.service.findOne({});
    if (existingHome) {
      throw new AppError("homeEntryAlreadyExists", 409);
    }

    // Create the home entry
    const home = await this.service.create(homeData);

    return home;
  }

  public async update(req: Request) {
    const { id } = req.params;
    const updateData: Partial<IHome> = req.body;

    validateUUID(id, "invalid home id");

    // Validate the update data
    this.service.validateUpdate(updateData);

    // Find the home entry first
    const home = await this.service.findOneByIdOrThrowError(id);

    // Update the home entry
    const updatedHome = await home.update(updateData);

    return updatedHome;
  }

  public async delete(req: Request) {
    const { id } = req.params;
    validateUUID(id, "invalid home id");

    // Find the home entry first to ensure it exists
    await this.service.findOneByIdOrThrowError(id);

    // Delete the home entry
    return this.service.delete(id);
  }

  public async getOne(req: Request) {
    const lng = req.language;

    let home: any = await this.service.findOne({
      attributes: [
        "id",
        [sequelize.col(lng === "ar" ? "titleAr" : "title"), "title"],
        "sections",
      ],
    });

    if (!home) return null;

    home = home.toJSON() as IHome;

    // Transform sections to match the language preference
    const transformedHome = {
      ...home,
      sections:
        home.sections?.map((section: any) => ({
          title: lng === "ar" ? section.titleAr : section.title,
          subtitle: lng === "ar" ? section.subtitleAr : section.subtitle,
        })) || [],
    };

    return transformedHome;
  }

  public async getOneForDashboard(req: Request) {
    let home: any = await this.service.findOne({
      attributes: ["id", "title", "titleAr", "sections"],
    });

    if (!home) return null;

    home = home.toJSON() as IHome;
    return home;
  }

  public async getAll(req: Request) {
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search } = req.query;
    const lng = req.language;

    const titleCol = lng === "ar" ? "titleAr" : "title";

    const options: any = {
      attributes: ["id", [sequelize.col(titleCol), "title"], "sections"],
      offset,
      limit,
      order: [[orderBy, order]],
      where: {},
    };

    if (search) {
      search = search.toString().replace(/\+/g, "").trim();
      options.where = {
        [Op.or]: [
          sequelize.where(sequelize.fn("LOWER", sequelize.col(titleCol)), {
            [Op.like]: `%${search.toLowerCase()}%`,
          }),
          // Add search in sections if needed
          sequelize.where(sequelize.cast(sequelize.col("sections"), "text"), {
            [Op.like]: `%${search.toLowerCase()}%`,
          }),
        ],
      };
    }

    const { rows, count } = await this.service.getAll(options);

    // Transform sections to match the language preference
    const transformedData = {
      count,
      rows: rows.map((row: any) => {
        const rowData = row.toJSON();
        return {
          ...rowData,
          sections:
            rowData.sections?.map((section: any) => ({
              title: lng === "ar" ? section.titleAr : section.title,
              subtitle: lng === "ar" ? section.subtitleAr : section.subtitle,
            })) || [],
        };
      }),
    };

    return transformedData;
  }

  public async updateSections(req: Request) {
    const { id } = req.params;
    const { sections } = req.body;

    validateUUID(id, "invalid home id");

    // Find the home entry first
    const home = await this.service.findOneByIdOrThrowError(id);

    // Update just the sections
    const updatedHome = await home.update({ sections });

    return updatedHome;
  }
}

export default HomeController;
