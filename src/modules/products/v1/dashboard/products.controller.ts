import { Op } from "sequelize";
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
import ProcessorService from "../../../processors/v1/website/processors.service";
export class ProductController {
  private static instance: ProductController | null = null;
  private service: PrdouctService;
  private brandService: BrandService;
  private CategoreyService: CategoryService;
  private storeService: StoreService;
  private processorService: ProcessorService;

  private constructor() {
    this.service = PrdouctService.getInstance();
    this.brandService = BrandService.getInstance();
    this.CategoreyService = CategoryService.getInstance();
    this.storeService = StoreService.getInstance();
    this.processorService = ProcessorService.getInstance();
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
    // await this.CategoreyService.findOneByIdOrThrowError(storeData.categoryId!);
    await this.storeService.findOneByIdOrThrowError(storeData.storeId!);
    await this.processorService.findOneByIdOrThrowError(storeData.processorId!);
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
    // if (updateData.categoryId)
    //   await this.CategoreyService.findOneByIdOrThrowError(
    //     updateData.categoryId!
    //   );
    if (updateData.storeId)
      await this.storeService.findOneByIdOrThrowError(updateData.storeId!);

    if (updateData.processorId)
      await this.processorService.findOneByIdOrThrowError(
        updateData.processorId!
      );
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

    const product = await this.service.findOneByIdOrThrowError(id, {
      attributes: [
        "id",
        "name",
        "nameAr",
        "description",
        "descriptionAr",
        "basePrice",
        "discount",
        "grantee",
        [
          sequelize.literal(
            'ROUND(CAST("basePrice" AS DECIMAL) * (1 - (CAST("discount" AS DECIMAL) / 100)), 2)'
          ),
          "priceAfterDiscount",
        ],
        "brandId",
        "categoryId",
        "categoryType",
        "storeId",
        "screenId",
        "processorId",
        "ram",
        "battery",
        "images",
        "image",
      ],
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
            "aspectRatio",
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
        { model: Brand, attributes: ["name", "nameAr"] },
        { model: Category, attributes: ["name", "nameAr"] },
        {
          model: Store,
          attributes: ["id", "name", "nameAr", "image", "allowShipping"],
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
      categoryIds,
      categoryType,
      battery,
      ram,
    } = req.query;
    let storeId = req.user?.storeId;
    const lng = req.language;
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
      // logging: console.log,
      attributes: [
        "id",
        [sequelize.literal(`"Product"."${nameColumn}"`), "name"],
        [sequelize.literal(`"Product"."${descriptionColumn}"`), "description"],
        "basePrice",
        "battery",
        "ram",
        "image",
        "discount",
        "grantee",
        "categoryType",
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
      ],
    };
    if (storeId) options.where.storeId = storeId;
    if (categoryType) options.where.categoryType = categoryType;

    if (maxPrice && minPrice) {
      options.where.basePrice = {
        [Op.between]: [Number(minPrice), Number(maxPrice)],
      };
    }
    if (battery) {
      options.where.battery = { [Op.gte]: Number(battery) };
    }
    if (ram) {
      options.where.ram = Number(ram);
    }
    if (brandIds) {
      brandIds = brandIds.toString();
      this.service.validateBrandsIds({ brandIds: brandIds.split(",") });
      options.where.brandId = { [Op.in]: brandIds.split(",") };
    }
    if (search) {
      search = search.toString().replace(/\+/g, "").trim();
      options.where.name = {
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
    }

    const date = await this.service.getAll(options);

    return date;
  }
}
