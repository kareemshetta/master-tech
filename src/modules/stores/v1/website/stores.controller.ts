import { AuthView } from "./../../../auth/v1/dashboard/auth.view";
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
import Product from "../../../../models/products.model";
import Review from "../../../../models/review.model";

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
    const lng = req.language;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";

    const store = await this.storeService.findOneByIdOrThrowError(id, {
      attributes: [
        "id",
        [sequelize.col(`stores."${nameColumn}"`), "name"],
        [sequelize.col(`stores."${descriptionColumn}"`), "description"],
        "location",
        "image",
        "phoneNumber",
      ],
      include: [
        {
          model: Store,
          attributes: [
            "id",
            [sequelize.col(`${nameColumn}"`), "name"],
            "phoneNumber",
          ],
          as: "subStores",
        },
        {
          model: Store,
          attributes: [
            "id",
            [sequelize.col(`${nameColumn}"`), "name"],
            "phoneNumber",
          ],
          as: "parentStore",
        },

        {
          model: City,
          attributes: ["id", [sequelize.col(`${nameColumn}"`), "name"]],
        },
        {
          model: Region,
          attributes: ["id", [sequelize.col(`${nameColumn}"`), "name"]],
        },
      ],
    });

    return store;
  }

  public async getAllStores(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search, storeIds, cityId, regionId } = req.query;
    const lng = req.language;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";

    this.storeService.validateGetAllStoresQuery({
      search,
      storeIds,
      cityId,
      regionId,
    });
    const options: any = {
      attributes: [
        "id",
        [sequelize.col(`stores."${nameColumn}"`), "name"], // nameAr or name ( depends on the language of the stores. ), "name"],
        [sequelize.col(`stores."${descriptionColumn}"`), "description"],
        [
          sequelize.fn(
            "ROUND",
            sequelize.fn(
              "COALESCE",
              sequelize.fn("AVG", sequelize.col("products->reviews.rating")),
              0
            ),
            2
          ),
          "averageRating",
        ],
        [
          sequelize.fn("COUNT", sequelize.col("products->reviews.id")),
          "totalReviews",
        ], // nameAr or name ( depends on the language of the stores. ), "name"],
        "phoneNumber",
        "location",
        "image",
      ],
      offset,
      limit,
      order: [[orderBy, order]],
      include: [
        {
          model: Product,
          as: "products",
          attributes: [],
          required: false,
          include: [
            {
              model: Review,
              as: "reviews",
              attributes: [],
              required: false,
            },
          ],
        },
        {
          model: City,
          attributes: ["id", [sequelize.col(`"${nameColumn}"`), "name"]],
        },
        {
          model: Region,
          attributes: ["id", [sequelize.col(`"${nameColumn}"`), "name"]],
        },
      ],
      group: [
        "stores.id",
        `stores.${nameColumn}`,
        `city.${nameColumn}`,
        `region.${nameColumn}`,
        "region.id",
        "city.id",
        // "stores.nameAr",

        // "stores.description",
        `stores.${descriptionColumn}`,
        // "stores.phoneNumber",
        // "stores.location",
        // "stores.image",
      ],
      where: {},
      subQuery: false,
    };
    const countOptions: any = {
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
            sequelize.fn("LOWER", sequelize.col(`stores."${nameColumn}"`)),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn(
              "LOWER",
              sequelize.col(`stores."${descriptionColumn}"`)
            ),
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
      countOptions.where.name = {
        [Op.or]: [
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col(`stores."${nameColumn}"`)),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn(
              "LOWER",
              sequelize.col(`stores."${descriptionColumn}"`)
            ),
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
      countOptions.where.parentId = { [Op.in]: storeIds };
    }
    if (cityId) {
      options.where.cityId = cityId;
      countOptions.where.cityId = cityId;
    }
    if (regionId) {
      options.where.regionId = regionId;
      countOptions.where.regionId = regionId;
    }
    const date = await this.storeService.getAllWithoutCount(options);

    const count = await this.storeService.count(countOptions);

    return { rows: date, count: count };
  }

  public async getAllHighRatedStores(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search, storeIds, cityId, regionId } = req.query;
    const lng = req.language;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";

    this.storeService.validateGetAllStoresQuery({
      search,
      storeIds,
      cityId,
      regionId,
    });
    // const options: any = {
    //   logging: console.log,
    //   attributes: [
    //     "id",
    //     [sequelize.col(`stores."${nameColumn}"`), "name"], // nameAr or name ( depends on the language of the stores. ), "name"],
    //     [sequelize.col(`stores."${descriptionColumn}"`), "description"], // nameAr or name ( depends on the language of the stores. ), "name"],
    //     "phoneNumber",
    //     "location",
    //     "image",
    //     [
    //       sequelize.fn(
    //         "ROUND",
    //         sequelize.literal('COUNT("products->reviews"."id") > 0'),
    //         2
    //       ),
    //       "averageRating",
    //     ],
    //     [
    //       sequelize.fn("COUNT", sequelize.col(`"products->reviews"."id"`)),
    //       "totalReviews",
    //     ],
    //   ],
    //   offset,
    //   limit,

    //   include: [
    //     {
    //       model: Product,
    //       as: "products",
    //       attributes: [],
    //       include: [
    //         {
    //           model: Review,
    //           attributes: [],
    //           required: false,
    //           // as: "reviews",
    //         },
    //       ],
    //     },
    //   ],
    //   group: ["stores.id"],
    //   having: sequelize.literal('COUNT("products->reviews"."id") > 0'),
    //   order: [[sequelize.literal("averageRating"), "DESC"]],
    //   where: {},
    // };
    const options: any = {
      // logging: console.log,
      attributes: [
        "id",
        [sequelize.col(`stores.${nameColumn}`), "name"], // Fix ambiguity by explicitly referencing "stores"
        [sequelize.col(`stores.${descriptionColumn}`), "description"],
        "phoneNumber",
        "location",
        "image",
        [
          sequelize.fn(
            "ROUND",
            sequelize.fn(
              "COALESCE",
              sequelize.fn("AVG", sequelize.col("products->reviews.rating")),
              0
            ),
            2
          ),
          "averageRating",
        ],
        [
          sequelize.fn("COUNT", sequelize.col("products->reviews.id")),
          "totalReviews",
        ],
      ],
      include: [
        {
          model: Product,
          as: "products",
          attributes: [],
          required: false,
          include: [
            {
              model: Review,
              as: "reviews",
              attributes: [],
              required: false,
            },
          ],
        },
      ],
      group: [
        "stores.id",
        `stores.${nameColumn}`,
        // "stores.nameAr",

        // "stores.description",
        `stores.${descriptionColumn}`,
        // "stores.phoneNumber",
        // "stores.location",
        // "stores.image",
      ],
      // having: sequelize.literal('COUNT("products->reviews"."id") > 0'),
      order: [
        [
          sequelize.fn(
            "ROUND",
            sequelize.fn(
              "COALESCE",
              sequelize.fn("AVG", sequelize.col("products->reviews.rating")),
              0
            ),
            2
          ),
          "DESC",
        ],
        [sequelize.fn("COUNT", sequelize.col("products->reviews.id")), "DESC"],
      ],
      where: {},
      offset,
      limit,
      subQuery: false,
    };
    const date = await this.storeService.getAllWithoutCount(options);

    return date;
  }
}

export default StoreController;
