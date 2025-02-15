import { FindAttributeOptions, Op } from "sequelize";
import { AppError } from "../../../../utils/appError";
import { IAttributes, IProduct } from "../../../../utils/shared.types";
import PrdouctService from "./products.service";
import { Request } from "express";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import sequelize from "../../../../config/db/config";
import BrandService from "../../../brands/v1/dashboard/brands.service";
import CategoryService from "../../../categories/v1/dashboard/categories.service";
import {
  checkArraysWithSet,
  getNotIncludedIds,
  validateUUID,
} from "../../../../utils/generalFunctions";
import StoreService from "../../../stores/v1/dashboard/stores.service";
import Brand from "../../../../models/brands.model";
import Store from "../../../../models/stores.model";
import Category from "../../../../models/categories.model";
import { ProductSku } from "../../../../models/product_skus.model";
import Product from "../../../../models/products.model";
import ProductAttribute from "../../../../models/product_attributes.model";
import Screen from "../../../../models/screen.model";
import Processor from "../../../../models/processor.model";
import { Literal } from "sequelize/types/utils";
import Review from "../../../../models/review.model";
export class ProductController {
  private static instance: ProductController | null = null;
  private service: PrdouctService;
  private brandService: BrandService;
  private CategoreyService: CategoryService;
  private storeService: StoreService;
  // private favouriteLiteral: string|Literal;
  private constructor() {
    this.service = PrdouctService.getInstance();
    this.brandService = BrandService.getInstance();
    this.CategoreyService = CategoryService.getInstance();
    this.storeService = StoreService.getInstance();
  }

  public static getInstance(): ProductController {
    if (!ProductController.instance) {
      ProductController.instance = new ProductController();
    }
    return ProductController.instance;
  }

  public async create(req: Request) {
    const storeData: IProduct = req.body;
    let storeId = req.user?.storeId;
    // Validate the incoming data
    if (storeId && storeData.storeId && storeId !== storeData.storeId) {
      throw new AppError("forbiden", 403);
    }
    if (req.user?.role !== "superAdmin") storeData.storeId = storeId;
    this.service.validateCreate(storeData);

    // const foundOneWithSameName = await this.service.findOne({
    //   where: { name: storeData.name },
    // });
    // if (foundOneWithSameName) {
    //   throw new AppError("entityWithNameExist", 409);
    // }

    await this.brandService.findOneByIdOrThrowError(storeData.brandId!);
    await this.CategoreyService.findOneByIdOrThrowError(storeData.categoryId!);
    await this.storeService.findOneByIdOrThrowError(storeData.storeId!);
    const colorsAttributesIDs = storeData.skus!.map(
      (attr) => attr.colorAttributeId!
    );
    const storageAttributesIDs = storeData.skus!.map(
      (attr) => attr.storageAttributeId!
    );
    const ids = [...colorsAttributesIDs, ...storageAttributesIDs];

    const attr = (await this.service.attributesRepo.findAll({
      where: {
        id: { [Op.in]: ids },
      },
      attributes: ["id"],
    })) as IAttributes[];

    if (!attr.length) {
      throw new AppError("attNotFound", 404);
    }

    const attIds = attr.map((attr) => attr.id!);
    if (!checkArraysWithSet(ids, attIds)) {
      throw new AppError(
        "attNotFoundWithReplacer",
        404,
        getNotIncludedIds(ids, attIds).join(", ")
      );
    }
    // Create the product
    const product = await this.service.create(storeData);

    return product;
  }

  private getFavouriteLiteral(userId: string): [Literal, string] {
    return [
      sequelize.literal(`
  CASE 
    WHEN EXISTS (
      SELECT 1
      FROM "userFavorites" AS "Favourite"
      WHERE "Favourite"."productId" = "Product"."id"
      AND "Favourite"."userId" = '${userId}'
      AND "Favourite"."deletedAt" IS NULL  -- Check for paranoid deleted record
    ) THEN true
    ELSE false
  END
`),
      "isFavourite",
    ];
  }

  public async update(req: Request) {
    const { id } = req.params;
    const storeId = req.user?.storeId;
    const updateData: Partial<IProduct> = req.body;

    // Validate the update data
    updateData.id = id;
    this.service.validateUpdate(updateData);

    // Find the product first
    const product = (
      await this.service.findOneByIdOrThrowError(id)
    ).toJSON() as IProduct;
    if (req.user?.role !== "superAdmin" && product.storeId !== storeId) {
      throw new AppError("forbiden", 403);
    }
    // if (updateData.name) {
    //   const foundOneWithSameName = await this.service.findOne({
    //     where: { name: updateData.name, id: { [Op.ne]: id } },
    //   });
    //   if (foundOneWithSameName) {
    //     throw new AppError("entityWithNameExist", 409);
    //   }
    // }
    if (updateData.brandId)
      await this.brandService.findOneByIdOrThrowError(updateData.brandId!);
    if (updateData.categoryId)
      await this.CategoreyService.findOneByIdOrThrowError(
        updateData.categoryId!
      );
    if (updateData.storeId)
      await this.storeService.findOneByIdOrThrowError(updateData.storeId!);
    if (updateData.skus && updateData) {
      const colorsAttributesIDs = updateData.skus!.map(
        (attr) => attr.colorAttributeId!
      );
      const storageAttributesIDs = updateData.skus!.map(
        (attr) => attr.storageAttributeId!
      );
      const ids = [...colorsAttributesIDs, ...storageAttributesIDs];

      const attr = (await this.service.attributesRepo.findAll({
        where: {
          id: { [Op.in]: ids },
        },
        attributes: ["id"],
      })) as IAttributes[];

      if (!attr.length) {
        throw new AppError("attNotFound", 404);
      }

      const attIds = attr.map((attr) => attr.id!);
      if (!checkArraysWithSet(ids, attIds)) {
        throw new AppError(
          "attNotFoundWithReplacer",
          404,
          getNotIncludedIds(ids, attIds).join(", ")
        );
      }
    }

    const updated = await this.service.update(updateData);

    return updated;
  }

  public async delete(req: Request) {
    const { id } = req.params;
    let storeId = req.user?.storeId;
    validateUUID(id, "invalid product id");
    const product = (
      await this.service.findOneByIdOrThrowError(id)
    ).toJSON() as IProduct;
    if (req.user?.role !== "superAdmin" && product.storeId !== storeId) {
      throw new AppError("forbiden", 403);
    }
    // Delete the product
    return this.service.delete(id);
  }

  public async get(req: Request) {
    const { id } = req.params;
    const lng = req.language;
    const userId = req.user?.id;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
    // Explicitly type the array as FindAttributeOptions
    const arr: FindAttributeOptions = [
      "id",
      [sequelize.literal(`"Product"."${nameColumn}"`), "name"],
      [sequelize.literal(`"Product"."${descriptionColumn}"`), "description"],
      "basePrice",
      "discount",
      [
        sequelize.literal(
          'ROUND(CAST("basePrice" AS DECIMAL) * (1 - (CAST("discount" AS DECIMAL) / 100)), 2)'
        ),
        "priceAfterDiscount",
      ],
      "brandId",
      "categoryId",
      "storeId",
      "screenId",
      "processorId",
      "ram",
      "battery",
    ];

    // Add favorite literal conditionally
    if (userId) arr.push(this.getFavouriteLiteral(userId) as [Literal, string]);

    const product = await this.service.findOneByIdOrThrowError(id, {
      attributes: arr,
      include: [
        {
          model: Screen,
          attributes: [
            "id",
            "size",
            "refreshRate",
            "pixelDensity",
            "type",
            "details",
          ],
        },
        {
          model: Processor,
          attributes: ["id", "type", "noOfCores", "details"],
        },

        {
          model: ProductSku,
          attributes: [
            "id",
            "sku",
            "price",
            "quantity",
            [
              sequelize.literal(
                'ROUND(CAST("price" AS DECIMAL) * (1 - (CAST("Product"."discount" AS DECIMAL) / 100)), 2)'
              ),
              "priceAfterDiscount",
            ],
            [
              sequelize.literal(
                'CASE WHEN "quantity" > 0 THEN true ELSE false END'
              ),
              "isAvailable",
            ],
          ],
          as: "skus",
          include: [
            {
              model: ProductAttribute,
              attributes: ["id", "type", "value"],
              as: "color",
            },
            {
              model: ProductAttribute,
              attributes: ["id", "type", "value"],
              as: "storage",
            },
          ],
        },
        {
          model: Brand,
          attributes: [[sequelize.literal(`brand."${nameColumn}"`), "name"]],
        },
        {
          model: Category,
          attributes: [[sequelize.literal(`category."${nameColumn}"`), "name"]],
        },
        {
          model: Store,
          attributes: [
            "id",
            [sequelize.literal(`store."${nameColumn}"`), "name"],
            "image",
            "allowShipping",
          ],
          as: "store",
        },
      ],
    });

    return product;
  }

  public async getAll(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let {
      search,
      maxPrice,
      minPrice,
      brandIds,
      storeId,
      categoryId,
      battery,
      ram,
    } = req.query;

    const lng = req.language;
    const userId = req.user?.id;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
    this.service.validateGetAllStoresQuery({
      search,
      maxPrice,
      minPrice,
      battery,
      ram,
    });
    const options: any = {
      attributes: [
        "id",
        [sequelize.literal(`"Product"."${nameColumn}"`), "name"],
        [sequelize.literal(`"Product"."${descriptionColumn}"`), "description"],
        [
          sequelize.fn(
            "ROUND",
            sequelize.fn(
              "COALESCE",
              sequelize.fn("AVG", sequelize.col("reviews.rating")),
              0
            ),
            2
          ),
          "averageRating",
        ],
        "basePrice",
        "battery",
        "ram",
        "brandId",
        "storeId",
        "image",
        "discount",
        [
          sequelize.literal(
            'ROUND(CAST("basePrice" AS DECIMAL) * (1 - (CAST("discount" AS DECIMAL) / 100)), 2)'
          ),
          "priceAfterDiscount",
        ],
      ],
      offset,
      limit,
      order: [[orderBy, order]],
      where: {},
      include: [
        {
          model: Store,
          attributes: [
            "id",
            [sequelize.literal(`store."${nameColumn}"`), "name"],
            // [sequelize.literal(`"${descriptionColumn}"`), "description"],
            "image",
          ],
          as: "store",
        },
        {
          model: Category,
          attributes: [
            [sequelize.literal(`category."${nameColumn}"`), "name"],
            // [sequelize.literal(`"${descriptionColumn}"`), "description"],
          ],
        },
        { model: Review, attributes: [] },
      ],
      group: ["Product.id", "store.id", "category.id"],
      subQuery: false,
    };
    const countOption: any = {
      offset,
      limit,
      order: [[orderBy, order]],
      where: {},
    };

    if (storeId) {
      options.where.storeId = storeId;
      countOption.where.storeId = storeId;
    }
    if (categoryId) {
      options.where.storeId = categoryId;
      countOption.where.storeId = categoryId;
    }

    if (userId)
      options.attributes.push([
        sequelize.literal(`
    CASE 
      WHEN EXISTS (
        SELECT 1
        FROM "userFavorites" AS "Favourite"
        WHERE "Favourite"."productId" = "Product"."id"
        AND "Favourite"."userId" = '${userId}'
        AND "Favourite"."deletedAt" IS NULL  -- Check for paranoid deleted record
      ) THEN true
      ELSE false
    END
  `),
        "isFavourite",
      ]);
    if (maxPrice && minPrice) {
      options.where.basePrice = {
        [Op.between]: [Number(minPrice), Number(maxPrice)],
      };
      countOption.where.basePrice = {
        [Op.between]: [Number(minPrice), Number(maxPrice)],
      };
    }
    if (battery) {
      options.where.battery = { [Op.gte]: Number(battery) };
      countOption.where.battery = { [Op.gte]: Number(battery) };
    }
    if (ram) {
      options.where.ram = Number(ram);
      countOption.where.ram = Number(ram);
    }
    if (brandIds) {
      brandIds = brandIds.toString();
      this.service.validateBrandsIds({ brandIds: brandIds.split(",") });
      options.where.brandId = { [Op.in]: brandIds.split(",") };
      countOption.where.brandId = { [Op.in]: brandIds.split(",") };
    }
    if (search) {
      search = search.toString().replace(/\+/g, "").trim();
      const searchOp = {
        [Op.or]: [
          sequelize.where(
            sequelize.fn(
              "LOWER",
              sequelize.literal(`"Product"."${nameColumn}"`)
            ),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn(
              "LOWER",
              sequelize.literal(`"Product"."${descriptionColumn}"`)
            ),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
        ],
      };
      options.where.name = searchOp;
      countOption.where.name = searchOp;
    }

    const date = await this.service.getAllWithoutCount(options);
    const count = await this.service.count(countOption);

    return { rows: date, count };
  }

  public async getAllTopRated(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let {
      search,
      maxPrice,
      minPrice,
      brandIds,
      storeId,
      categoryId,
      battery,
      ram,
    } = req.query;

    const lng = req.language;
    const userId = req.user?.id;
    const nameColumn = lng === "ar" ? "nameAr" : "name";
    const descriptionColumn = lng === "ar" ? "descriptionAr" : "description";
    this.service.validateGetAllStoresQuery({
      search,
      maxPrice,
      minPrice,
      battery,
      ram,
    });
    const options: any = {
      attributes: [
        "id",
        [sequelize.literal(`"Product"."${nameColumn}"`), "name"],
        [sequelize.literal(`"Product"."${descriptionColumn}"`), "description"],
        [
          sequelize.fn(
            "ROUND",
            sequelize.fn(
              "COALESCE",
              sequelize.fn("AVG", sequelize.col("reviews.rating")),
              0
            ),
            2
          ),
          "averageRating",
        ],
        "basePrice",
        "battery",
        "ram",
        "brandId",
        "storeId",
        "image",
        "discount",
        [
          sequelize.literal(
            'ROUND(CAST("basePrice" AS DECIMAL) * (1 - (CAST("discount" AS DECIMAL) / 100)), 2)'
          ),
          "priceAfterDiscount",
        ],
      ],
      offset,
      limit,
      order: [[orderBy, order]],
      where: {},
      include: [
        {
          model: Store,
          attributes: [
            "id",
            [sequelize.literal(`store."${nameColumn}"`), "name"],
            // [sequelize.literal(`"${descriptionColumn}"`), "description"],
            "image",
          ],
          as: "store",
        },
        {
          model: Category,
          attributes: [
            [sequelize.literal(`category."${nameColumn}"`), "name"],
            // [sequelize.literal(`"${descriptionColumn}"`), "description"],
          ],
        },
        { model: Review, attributes: [] },
      ],
      group: ["Product.id", "store.id", "category.id"],
      subQuery: false,
    };
    const countOption: any = {
      offset,
      limit,
      order: [
        [
          sequelize.fn(
            "ROUND",
            sequelize.fn(
              "COALESCE",
              sequelize.fn("AVG", sequelize.col("reviews.rating")),
              0
            ),
            2
          ),
          "DESC",
        ],
      ],
      where: {},
    };

    if (storeId) {
      options.where.storeId = storeId;
      countOption.where.storeId = storeId;
    }
    if (categoryId) {
      options.where.storeId = categoryId;
      countOption.where.storeId = categoryId;
    }

    if (userId)
      options.attributes.push([
        sequelize.literal(`
    CASE 
      WHEN EXISTS (
        SELECT 1
        FROM "userFavorites" AS "Favourite"
        WHERE "Favourite"."productId" = "Product"."id"
        AND "Favourite"."userId" = '${userId}'
        AND "Favourite"."deletedAt" IS NULL  -- Check for paranoid deleted record
      ) THEN true
      ELSE false
    END
  `),
        "isFavourite",
      ]);
    if (maxPrice && minPrice) {
      options.where.basePrice = {
        [Op.between]: [Number(minPrice), Number(maxPrice)],
      };
      countOption.where.basePrice = {
        [Op.between]: [Number(minPrice), Number(maxPrice)],
      };
    }
    if (battery) {
      options.where.battery = { [Op.gte]: Number(battery) };
      countOption.where.battery = { [Op.gte]: Number(battery) };
    }
    if (ram) {
      options.where.ram = Number(ram);
      countOption.where.ram = Number(ram);
    }
    if (brandIds) {
      brandIds = brandIds.toString();
      this.service.validateBrandsIds({ brandIds: brandIds.split(",") });
      options.where.brandId = { [Op.in]: brandIds.split(",") };
      countOption.where.brandId = { [Op.in]: brandIds.split(",") };
    }
    if (search) {
      search = search.toString().replace(/\+/g, "").trim();
      const searchOp = {
        [Op.or]: [
          sequelize.where(
            sequelize.fn(
              "LOWER",
              sequelize.literal(`"Product"."${nameColumn}"`)
            ),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
          sequelize.where(
            sequelize.fn(
              "LOWER",
              sequelize.literal(`"Product"."${descriptionColumn}"`)
            ),
            "LIKE",
            "%" + search.toLowerCase() + "%"
          ),
        ],
      };
      options.where.name = searchOp;
      countOption.where.name = searchOp;
    }

    const date = await this.service.getAllWithoutCount(options);
    const count = await this.service.count(countOption);

    return { rows: date, count };
  }

  public async toggleFavourite(req: Request) {
    const { productId } = req.params;
    const userId = req.user?.id;
    validateUUID(productId, "invalid product id");
    validateUUID(userId, "invalid user id");
    const product = await this.service.findOneByIdOrThrowError(productId);

    const isFavourite = await this.service.toggleFavourite({
      productId,
      userId,
    });
    return isFavourite;
  }
}
