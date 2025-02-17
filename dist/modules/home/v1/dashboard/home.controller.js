"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeController = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../../../../config/db/config"));
const appError_1 = require("../../../../utils/appError");
const home_service_1 = __importDefault(require("./home.service"));
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const generalFunctions_1 = require("../../../../utils/generalFunctions");
class HomeController {
    constructor() {
        this.service = home_service_1.default.getInstance();
    }
    static getInstance() {
        if (!HomeController.instance) {
            HomeController.instance = new HomeController();
        }
        return HomeController.instance;
    }
    async create(req) {
        const homeData = req.body;
        // Validate the incoming data
        this.service.validateCreate(homeData);
        // Check if a home entry already exists since we typically want only one
        const existingHome = await this.service.findOne({});
        if (existingHome) {
            throw new appError_1.AppError("homeEntryAlreadyExists", 409);
        }
        // Create the home entry
        const home = await this.service.create(homeData);
        return home;
    }
    async update(req) {
        const { id } = req.params;
        const updateData = req.body;
        (0, generalFunctions_1.validateUUID)(id, "invalid home id");
        // Validate the update data
        this.service.validateUpdate(updateData);
        // Find the home entry first
        const home = await this.service.findOneByIdOrThrowError(id);
        // Update the home entry
        const updatedHome = await home.update(updateData);
        return updatedHome;
    }
    async delete(req) {
        const { id } = req.params;
        (0, generalFunctions_1.validateUUID)(id, "invalid home id");
        // Find the home entry first to ensure it exists
        await this.service.findOneByIdOrThrowError(id);
        // Delete the home entry
        return this.service.delete(id);
    }
    async getOne(req) {
        const lng = req.language;
        let home = await this.service.findOne({
            attributes: [
                "id",
                [config_1.default.col(lng === "ar" ? "titleAr" : "title"), "title"],
                "sections",
            ],
        });
        if (!home)
            return null;
        home = home.toJSON();
        // Transform sections to match the language preference
        const transformedHome = {
            ...home,
            sections: home.sections?.map((section) => ({
                image: section.image,
                title: lng === "ar" ? section.titleAr : section.title,
                subtitle: lng === "ar" ? section.subtitleAr : section.subtitle,
            })) || [],
        };
        return transformedHome;
    }
    async getOneForDashboard(req) {
        let home = await this.service.findOne({
            attributes: ["id", "title", "titleAr", "sections"],
        });
        if (!home)
            return null;
        home = home.toJSON();
        return home;
    }
    async getAll(req) {
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search } = req.query;
        const lng = req.language;
        const titleCol = lng === "ar" ? "titleAr" : "title";
        const options = {
            attributes: ["id", [config_1.default.col(titleCol), "title"], "sections"],
            offset,
            limit,
            order: [[orderBy, order]],
            where: {},
        };
        if (search) {
            search = search.toString().replace(/\+/g, "").trim();
            options.where = {
                [sequelize_1.Op.or]: [
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(titleCol)), {
                        [sequelize_1.Op.like]: `%${search.toLowerCase()}%`,
                    }),
                    // Add search in sections if needed
                    config_1.default.where(config_1.default.cast(config_1.default.col("sections"), "text"), {
                        [sequelize_1.Op.like]: `%${search.toLowerCase()}%`,
                    }),
                ],
            };
        }
        const { rows, count } = await this.service.getAll(options);
        // Transform sections to match the language preference
        const transformedData = {
            count,
            rows: rows.map((row) => {
                const rowData = row.toJSON();
                return {
                    ...rowData,
                    sections: rowData.sections?.map((section) => ({
                        image: section.image,
                        title: lng === "ar" ? section.titleAr : section.title,
                        subtitle: lng === "ar" ? section.subtitleAr : section.subtitle,
                    })) || [],
                };
            }),
        };
        return transformedData;
    }
    async updateSections(req) {
        const { id } = req.params;
        const { sections } = req.body;
        (0, generalFunctions_1.validateUUID)(id, "invalid home id");
        // Find the home entry first
        const home = await this.service.findOneByIdOrThrowError(id);
        // Update just the sections
        const updatedHome = await home.update({ sections });
        return updatedHome;
    }
}
exports.HomeController = HomeController;
HomeController.instance = null;
exports.default = HomeController;
