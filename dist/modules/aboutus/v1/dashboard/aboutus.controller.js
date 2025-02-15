"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutusController = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../../../../config/db/config"));
const appError_1 = require("../../../../utils/appError");
const aboutus_service_1 = __importDefault(require("./aboutus.service"));
const handle_sort_pagination_1 = require("../../../../utils/handle-sort-pagination");
const generalFunctions_1 = require("../../../../utils/generalFunctions");
class AboutusController {
    constructor() {
        this.service = aboutus_service_1.default.getInstance();
    }
    static getInstance() {
        if (!AboutusController.instance) {
            AboutusController.instance = new AboutusController();
        }
        return AboutusController.instance;
    }
    async create(req) {
        const aboutusData = req.body;
        // Validate the incoming data
        this.service.validateCreate(aboutusData);
        // Check if an aboutus entry already exists since we typically want only one
        const existingAboutus = await this.service.findOne({});
        if (existingAboutus) {
            throw new appError_1.AppError("aboutusEntryAlreadyExists", 409);
        }
        let counter = 0;
        // Create the aboutus entry
        aboutusData.faqs = aboutusData.faqs?.map((faq) => {
            return {
                ...faq,
                id: ++counter,
            };
        });
        const aboutus = await this.service.create(aboutusData);
        return aboutus;
    }
    async update(req) {
        const { id } = req.params;
        const updateData = req.body;
        (0, generalFunctions_1.validateUUID)(id, "invalid aboutus id");
        let counter = 0;
        // Validate the update data
        this.service.validateUpdate(updateData);
        if (updateData.faqs) {
            updateData.faqs = updateData.faqs?.map((faq) => {
                return {
                    ...faq,
                    id: ++counter,
                };
            });
        }
        // Find the aboutus entry first
        const aboutus = await this.service.findOneByIdOrThrowError(id);
        // Update the aboutus entry
        const updatedAboutus = await aboutus.update(updateData);
        return updatedAboutus;
    }
    async delete(req) {
        const { id } = req.params;
        (0, generalFunctions_1.validateUUID)(id, "invalid aboutus id");
        // Find the aboutus entry first to ensure it exists
        await this.service.findOneByIdOrThrowError(id);
        // Delete the aboutus entry
        return this.service.delete(id);
    }
    async getOne(req) {
        const lng = req.language;
        // Define language-specific column mappings
        const columns = {
            ourMessage: lng === "ar" ? "ourMessageAr" : "ourMessage",
            ourVision: lng === "ar" ? "ourVisionAr" : "ourVision",
            whoAreWe: lng === "ar" ? "whoAreWeAr" : "whoAreWe",
        };
        let aboutus = await this.service.findOne({
            attributes: [
                "id",
                [config_1.default.col(columns.ourMessage), "ourMessage"],
                [config_1.default.col(columns.ourVision), "ourVision"],
                [config_1.default.col(columns.whoAreWe), "whoAreWe"],
                "faqs",
            ],
        });
        if (!aboutus)
            return null;
        aboutus = aboutus.toJSON();
        // Transform FAQs to match the language preference
        const transformedAboutus = {
            ...aboutus,
            faqs: aboutus.faqs?.map((faq) => ({
                id: faq.id,
                question: lng === "ar" ? faq.questionAr : faq.question,
                answer: lng === "ar" ? faq.answerAr : faq.answer,
            })) || [],
        };
        return transformedAboutus;
    }
    async getOneForDashboard(req) {
        let aboutus = await this.service.findOne({
            attributes: [
                "id",
                "ourMessageAr",
                "ourMessage",
                "ourVisionAr",
                "ourVision",
                "whoAreWeAr",
                "whoAreWe",
                "faqs",
            ],
        });
        if (!aboutus)
            return null;
        aboutus = aboutus.toJSON();
        // Transform FAQs to match the language preference
        return aboutus;
    }
    // public async getAll(req: Request) {
    //   const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    //   let { search } = req.query;
    //   const lng = req.language;
    //   // Define language-specific column mappings
    //   const columns = {
    //     ourMessage: lng === "ar" ? "ourMessageAr" : "ourMessage",
    //     ourVision: lng === "ar" ? "ourVisionAr" : "ourVision",
    //     whoAreWe: lng === "ar" ? "whoAreWeAr" : "whoAreWe",
    //   };
    //   const options: any = {
    //     attributes: [
    //       "id",
    //       [sequelize.col(`aboutus."${columns.ourMessage}"`), "ourMessage"],
    //       [sequelize.col(`aboutus."${columns.ourVision}"`), "ourVision"],
    //       [sequelize.col(`aboutus."${columns.whoAreWe}"`), "whoAreWe"],
    //       [
    //         sequelize.fn(
    //           "json_agg",
    //           sequelize.fn(
    //             "json_build_object",
    //             "id",
    //             sequelize.col("faqs.id"),
    //             "question",
    //             sequelize.col(lng === "ar" ? "faqs.questionAr" : "faqs.question"),
    //             "answer",
    //             sequelize.col(lng === "ar" ? "faqs.answerAr" : "faqs.answer")
    //           )
    //         ),
    //         "faqs",
    //       ],
    //     ],
    //     offset,
    //     limit,
    //     order: [[orderBy, order]],
    //     where: {},
    //     group: ["aboutus.id"],
    //   };
    //   if (search) {
    //     search = search.toString().replace(/\+/g, "").trim();
    //     options.where = {
    //       [Op.or]: [
    //         sequelize.where(
    //           sequelize.fn(
    //             "LOWER",
    //             sequelize.col(`aboutus."${columns.ourMessage}"`)
    //           ),
    //           { [Op.like]: `%${search.toLowerCase()}%` }
    //         ),
    //         sequelize.where(
    //           sequelize.fn(
    //             "LOWER",
    //             sequelize.col(`aboutus."${columns.ourVision}"`)
    //           ),
    //           { [Op.like]: `%${search.toLowerCase()}%` }
    //         ),
    //         sequelize.where(
    //           sequelize.fn(
    //             "LOWER",
    //             sequelize.col(`aboutus."${columns.whoAreWe}"`)
    //           ),
    //           { [Op.like]: `%${search.toLowerCase()}%` }
    //         ),
    //       ],
    //     };
    //   }
    //   const data = await this.service.getAll(options);
    //   return data;
    // }
    async getAll(req) {
        const { limit, offset, order, orderBy } = (0, handle_sort_pagination_1.handlePaginationSort)(req.query);
        let { search } = req.query;
        const lng = req.language;
        // Define language-specific column mappings
        const columns = {
            ourMessage: lng === "ar" ? "ourMessageAr" : "ourMessage",
            ourVision: lng === "ar" ? "ourVisionAr" : "ourVision",
            whoAreWe: lng === "ar" ? "whoAreWeAr" : "whoAreWe",
        };
        const options = {
            attributes: [
                "id",
                [config_1.default.col(`${columns.ourMessage}`), "ourMessage"],
                [config_1.default.col(`${columns.ourVision}`), "ourVision"],
                [config_1.default.col(`${columns.whoAreWe}`), "whoAreWe"],
                "faqs",
            ],
            offset,
            limit,
            order: [[orderBy, order]],
            where: {},
        };
        if (search) {
            search = search.toString().replace(/\+/g, "").trim();
            options.where = {
                [sequelize_1.Op.or]: [
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(columns.ourMessage)), { [sequelize_1.Op.like]: `%${search.toLowerCase()}%` }),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(columns.ourVision)), { [sequelize_1.Op.like]: `%${search.toLowerCase()}%` }),
                    config_1.default.where(config_1.default.fn("LOWER", config_1.default.col(columns.whoAreWe)), { [sequelize_1.Op.like]: `%${search.toLowerCase()}%` }),
                ],
            };
        }
        const { rows, count } = await this.service.getAll(options);
        // Transform FAQs to match the language preference
        const transformedData = {
            count,
            rows: rows.map((row) => ({
                ...row.toJSON(),
                faqs: row.faqs?.map((faq) => ({
                    id: faq.id,
                    question: lng === "ar" ? faq.questionAr : faq.question,
                    answer: lng === "ar" ? faq.answerAr : faq.answer,
                })) || [],
            })),
        };
        return transformedData;
    }
    async updateFaqs(req) {
        const { id } = req.params;
        const { faqs } = req.body;
        (0, generalFunctions_1.validateUUID)(id, "invalid aboutus id");
        // Find the aboutus entry first
        const aboutus = await this.service.findOneByIdOrThrowError(id);
        // Update just the FAQs
        const updatedAboutus = await aboutus.update({ faqs });
        return updatedAboutus;
    }
}
exports.AboutusController = AboutusController;
AboutusController.instance = null;
exports.default = AboutusController;
