import { CountOptions, FindAndCountOptions, FindOptions } from "sequelize";
import { ICity, IReview } from "../../../../utils/shared.types";

import Joi from "joi";
import { ValidationError } from "../../../../utils/appError";
import ReviewRepository from "../reviews.repository";

export class ReviewService {
  private static instance: ReviewService | null = null;
  private repo: ReviewRepository;

  private constructor() {
    this.repo = ReviewRepository.getInstance();
  }

  public static getInstance(): ReviewService {
    if (!ReviewService.instance) {
      ReviewService.instance = new ReviewService();
    }
    return ReviewService.instance;
  }

  public async create(data: ICity) {
    return this.repo.create(data);
  }

  public async delete(catId: string) {
    return this.repo.delete({ where: { id: catId } });
  }

  public async findOneByIdOrThrowError(
    catId: string,
    options: FindOptions = {}
  ) {
    return this.repo.findOneByIdOrThrowError(catId, options);
  }

  public async findOne(options: FindOptions = {}) {
    return this.repo.findOne(options);
  }

  public async getAll(options: FindAndCountOptions = {}) {
    return this.repo.findAndCountAll(options);
  }

  public async count(options: CountOptions = {}) {
    return this.repo.count(options);
  }
  public validateCreate(data: IReview) {
    const schema = Joi.object({
      rating: Joi.number().integer().min(1).max(5).required().messages({
        "number.base": "Rating must be a number.",
        "number.integer": "Rating must be an integer.",
        "number.min": "Rating must be at least 1.",
        "number.max": "Rating cannot exceed 5.",
        "any.required": "Rating is required and cannot be null.",
      }),

      message: Joi.string().trim().required().messages({
        "string.base": "Message must be a string.",
        "string.empty": "Message cannot be empty.",
        "any.required": "Message is required and cannot be null.",
      }),

      userId: Joi.string().required().messages({
        "string.base": "User ID must be a string.",
        "string.empty": "User ID cannot be empty.",
        "any.required": "User ID is required and cannot be null.",
      }),

      productId: Joi.string().required().messages({
        "string.base": "Product ID must be a string.",
        "string.empty": "Product ID cannot be empty.",
        "any.required": "Product ID is required and cannot be null.",
      }),
    });

    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateUpdate(data: Partial<IReview>) {
    const schema = Joi.object({
      id: Joi.string().uuid().required().messages({
        "string.base": "ID must be a string.",
        "string.guid": "ID must be a valid UUID.",
        "any.required": "ID is required and cannot be null.",
      }),

      rating: Joi.number().integer().min(1).max(5).messages({
        "number.base": "Rating must be a number.",
        "number.integer": "Rating must be an integer.",
        "number.min": "Rating must be at least 1.",
        "number.max": "Rating cannot exceed 5.",
      }),

      message: Joi.string().trim().messages({
        "string.base": "Message must be a string.",
        "string.empty": "Message cannot be empty.",
      }),
    });

    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateGetAllStoresQuery(query: { productId: string; search?: any }) {
    const schema = Joi.object({
      search: Joi.string().trim().max(255).allow("").messages({
        "string.base": "Search term must be a string.",
        "string.max": "Search term cannot exceed 255 characters.",
      }),
      productId: Joi.string().uuid().required().messages({
        "string.base": "Product ID must be a string.",
        "string.guid": "Product ID must be a valid UUID.",
        "any.required": "Product ID is required and cannot be null.",
      }),
    });

    const { error } = schema.validate(query);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }
}

export default ReviewService;
