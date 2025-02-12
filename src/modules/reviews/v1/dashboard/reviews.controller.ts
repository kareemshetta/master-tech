import { PrdouctService } from "./../../../products/v1/dashboard/products.service";
import { col, fn, Op } from "sequelize";
import { AppError } from "../../../../utils/appError";
import { IReview } from "../../../../utils/shared.types";
import { Request } from "express";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import sequelize from "../../../../config/db/config";
import { validateUUID } from "../../../../utils/generalFunctions";
import Region from "../../../../models/regions.model";
import ReviewService from "./reviews.service";
import User from "../../../../models/users.model";

type RatingData = {
  rating: number;
  count: number;
};
export class ReviewController {
  private static instance: ReviewController | null = null;
  private service: ReviewService;
  private productService: PrdouctService;

  private constructor() {
    this.service = ReviewService.getInstance();
    this.productService = PrdouctService.getInstance();
  }

  public static getInstance(): ReviewController {
    if (!ReviewController.instance) {
      ReviewController.instance = new ReviewController();
    }
    return ReviewController.instance;
  }

  public async create(req: Request) {
    const storeData: IReview = req.body;
    const userId = req.user?.id;
    // Validate the incoming data
    const body = { ...storeData, userId: userId };
    this.service.validateCreate(body);
    await this.productService.findOneByIdOrThrowError(body.productId!);
    const found = await this.service.findOne({
      where: { productId: body.productId, userId: body.userId },
    });
    if (found) {
      throw new AppError("entityWithNameExist", 409);
    }

    // Create the city
    const review = await this.service.create(body);

    return review;
  }

  public async update(req: Request) {
    const { id } = req.params;
    const updateData: Partial<IReview> = req.body;
    const userId = req.user?.id;
    // Validate the update data
    this.service.validateUpdate(updateData);

    const found = await this.service.findOneByIdOrThrowError(id, {
      attributes: ["id", "userId"],
    });
    if (found.get("userId") != userId) {
      throw new AppError("forbiden", 403);
    }
    // Update the city
    const updatedCat = await found.update(updateData);

    return updatedCat;
  }

  public async delete(req: Request) {
    const { id } = req.params;

    const found = await this.service.findOneByIdOrThrowError(id, {
      attributes: ["id", "userId"],
    });

    // Delete the city
    return this.service.delete(id);
  }

  public async get(req: Request) {
    const { id } = req.params;

    const city = await this.service.findOneByIdOrThrowError(id, {
      attributes: ["id", "message", "rating", "createdAt"],
      include: [
        {
          model: User,
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "image",
          ],
        },
      ],
    });

    return city;
  }

  public async getAll(req: Request) {
    // Calculate offset for pagination
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search } = req.query;
    let { productId } = req.params;
    this.service.validateGetAllStoresQuery({ productId, search });
    const options: any = {
      attributes: ["id", "message", "rating", "createdAt"],
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "image"],
        },
      ],
      offset,
      limit,
      order: [[orderBy, order]],
      where: {
        productId,
      },
    };

    if (search) {
      search = search.toString().replace(/\+/g, "").trim();
      options.where = sequelize.where(
        sequelize.fn("LOWER", sequelize.col(`reviews."message"`)),
        {
          [Op.like]: `%${search.toLowerCase()}%`,
        }
      );
    }

    const datePromise = this.service.getAll(options);
    const countPromise = this.service.count({
      attributes: ["rating"],
      where: { productId },
      group: ["rating"],
    });

    const overallAveragePromise = this.service.findOne({
      attributes: [
        [fn("ROUND", fn("AVG", col("rating")), 2), "avg"],
        [fn("COUNT", col("rating")), "count"],
      ],
      where: { productId },
      raw: true,
    });

    let [date, count, overallAverage] = await Promise.all([
      datePromise,
      countPromise,
      overallAveragePromise,
    ]);
    count = this.fillMissingRatings(count);
    return { date, count, overallAverage };
  }

  public fillMissingRatings = (data: RatingData[]): RatingData[] => {
    const completeRatings = [1, 2, 3, 4, 5];

    // Create a Map for quick lookup
    const ratingMap = new Map<number, number>(
      data.map((item) => [item.rating, item.count])
    );

    // Ensure all ratings from 1 to 5 are present
    return completeRatings.map((rating) => ({
      rating,
      count: ratingMap.get(rating) || 0,
    }));
  };
}
