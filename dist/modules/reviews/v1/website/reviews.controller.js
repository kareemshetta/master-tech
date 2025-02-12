"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const products_service_1 = require("./../../../products/v1/dashboard/products.service");
const sequelize_1 = require("sequelize");
const appError_1 = require("../../../../utils/appError");
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const config_1 = __importDefault(require("../../../../config/db/config"));
const generalFunctions_1 = require("../../../../utils/generalFunctions");
const reviews_service_1 = __importDefault(require("./reviews.service"));
const users_model_1 = __importDefault(require("../../../../models/users.model"));
class ReviewController {
    constructor() {
        this.fillMissingRatings = (data) => {
            const completeRatings = [1, 2, 3, 4, 5];
            // Create a Map for quick lookup
            const ratingMap = new Map(data.map((item) => [item.rating, item.count]));
            // Ensure all ratings from 1 to 5 are present
            return completeRatings.map((rating) => ({
                rating,
                count: ratingMap.get(rating) || 0,
            }));
        };
        this.service = reviews_service_1.default.getInstance();
        this.productService = products_service_1.PrdouctService.getInstance();
    }
    static getInstance() {
        if (!ReviewController.instance) {
            ReviewController.instance = new ReviewController();
        }
        return ReviewController.instance;
    }
    async create(req) {
        const storeData = req.body;
        const userId = req.user?.id;
        // Validate the incoming data
        const body = { ...storeData, userId: userId };
        this.service.validateCreate(body);
        await this.productService.findOneByIdOrThrowError(body.productId);
        const found = await this.service.findOne({
            where: { productId: body.productId, userId: body.userId },
        });
        if (found) {
            throw new appError_1.AppError("entityWithNameExist", 409);
        }
        // Create the city
        const review = await this.service.create(body);
        return review;
    }
    async update(req) {
        const { id } = req.params;
        const updateData = req.body;
        const userId = req.user?.id;
        // Validate the update data
        this.service.validateUpdate({ ...updateData, id });
        const found = await this.service.findOneByIdOrThrowError(id, {
            attributes: ["id", "userId"],
        });
        if (found.get("userId") != userId) {
            throw new appError_1.AppError("forbiden", 403);
        }
        // Update the city
        const updatedCat = await found.update(updateData);
        return updatedCat;
    }
    async delete(req) {
        const { id } = req.params;
        const userId = req.user?.id;
        (0, generalFunctions_1.validateUUID)(id, "invalid review id");
        const found = await this.service.findOneByIdOrThrowError(id, {
            attributes: ["id", "userId"],
        });
        if (found.get("userId") != userId) {
            throw new appError_1.AppError("forbiden", 403);
        }
        // Delete the city
        return this.service.delete(id);
    }
    async get(req) {
        const { id } = req.params;
        const city = await this.service.findOneByIdOrThrowError(id, {
            attributes: ["id", "message", "rating", "createdAt"],
            include: [
                {
                    model: users_model_1.default,
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
    async getAll(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search } = req.query;
        let { productId } = req.params;
        this.service.validateGetAllStoresQuery({ productId, search });
        const options = {
            attributes: ["id", "message", "rating", "createdAt"],
            include: [
                {
                    model: users_model_1.default,
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
            options.where = config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(`reviews."message"`)), {
                [sequelize_1.Op.like]: `%${search.toLowerCase()}%`,
            });
        }
        const datePromise = this.service.getAll(options);
        const countPromise = this.service.count({
            attributes: ["rating"],
            where: { productId },
            group: ["rating"],
        });
        const overallAveragePromise = this.service.findOne({
            attributes: [
                [(0, sequelize_1.fn)("ROUND", (0, sequelize_1.fn)("AVG", (0, sequelize_1.col)("rating")), 2), "avg"],
                [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("rating")), "count"],
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
}
exports.ReviewController = ReviewController;
ReviewController.instance = null;
