"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactusController = void 0;
const sequelize_1 = require("sequelize");
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const config_1 = __importDefault(require("../../../../config/db/config"));
const generalFunctions_1 = require("../../../../utils/generalFunctions");
const contact_us_service_1 = __importDefault(require("./contact-us.service"));
class ContactusController {
    constructor() {
        this.service = contact_us_service_1.default.getInstance();
    }
    static getInstance() {
        if (!ContactusController.instance) {
            ContactusController.instance = new ContactusController();
        }
        return ContactusController.instance;
    }
    async create(req) {
        const storeData = req.body;
        this.service.validateCreate(storeData);
        // Create the city
        const review = await this.service.create(storeData);
        return review;
    }
    async delete(req) {
        const { id } = req.params;
        const found = await this.service.findOneByIdOrThrowError(id, {
            attributes: ["id", "contactType"],
        });
        // Delete the city
        return this.service.delete(id);
    }
    async get(req) {
        const { id } = req.params;
        (0, generalFunctions_1.validateUUID)(id, "invalid contactus id");
        const city = await this.service.findOneByIdOrThrowError(id, {
            attributes: { exclude: ["deletedAt", "updatedAt"] },
        });
        return city;
    }
    async getAll(req) {
        // Calculate offset for pagination
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search } = req.query;
        this.service.validateGetAllStoresQuery({ search });
        const options = {
            attributes: { exclude: ["deletedAt", "updatedAt"] },
            offset,
            limit,
            order: [[orderBy, order]],
            where: {},
        };
        if (search) {
            search = search.toString().replace(/\+/g, "").trim();
            options.where.name = {
                [sequelize_1.Op.or]: [
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.literal(`"contactus"."firstName"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.literal(`"contactus"."lastName"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.literal(`"contactus"."email"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.literal(`"contactus"."message"`)), "LIKE", "%" + search.toLowerCase() + "%"),
                ],
            };
        }
        return this.service.getAll(options);
    }
}
exports.ContactusController = ContactusController;
ContactusController.instance = null;
