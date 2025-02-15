import { Request } from "express";
import { DataTypes, Op } from "sequelize";
import sequelize from "../../../../config/db/config";
import { AppError } from "../../../../utils/appError";
import AboutusService from "./aboutus.service";
import { handlePaginationSort } from "../../../../utils/handle-sort-pagination";
import { validateUUID } from "../../../../utils/generalFunctions";
import { IAboutus } from "../../../../utils/shared.types";

export class AboutusController {
  private static instance: AboutusController | null = null;
  private service: AboutusService;

  private constructor() {
    this.service = AboutusService.getInstance();
  }

  public static getInstance(): AboutusController {
    if (!AboutusController.instance) {
      AboutusController.instance = new AboutusController();
    }
    return AboutusController.instance;
  }

  public async create(req: Request) {
    const aboutusData: IAboutus = req.body;

    // Validate the incoming data
    this.service.validateCreate(aboutusData);

    // Check if an aboutus entry already exists since we typically want only one
    const existingAboutus = await this.service.findOne({});
    if (existingAboutus) {
      throw new AppError("aboutusEntryAlreadyExists", 409);
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

  public async update(req: Request) {
    const { id } = req.params;
    const updateData: Partial<IAboutus> = req.body;

    validateUUID(id, "invalid aboutus id");
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

  public async delete(req: Request) {
    const { id } = req.params;
    validateUUID(id, "invalid aboutus id");

    // Find the aboutus entry first to ensure it exists
    await this.service.findOneByIdOrThrowError(id);

    // Delete the aboutus entry
    return this.service.delete(id);
  }

  public async getOne(req: Request) {
    const lng = req.language;

    // Define language-specific column mappings
    const columns = {
      ourMessage: lng === "ar" ? "ourMessageAr" : "ourMessage",
      ourVision: lng === "ar" ? "ourVisionAr" : "ourVision",
      whoAreWe: lng === "ar" ? "whoAreWeAr" : "whoAreWe",
    };

    let aboutus: any = await this.service.findOne({
      attributes: [
        "id",
        [sequelize.col(columns.ourMessage), "ourMessage"],
        [sequelize.col(columns.ourVision), "ourVision"],
        [sequelize.col(columns.whoAreWe), "whoAreWe"],
        "faqs",
      ],
    });

    if (!aboutus) return null;
    aboutus = aboutus.toJSON() as IAboutus;
    // Transform FAQs to match the language preference
    const transformedAboutus = {
      ...aboutus,
      faqs:
        aboutus.faqs?.map((faq: any) => ({
          id: faq.id,
          question: lng === "ar" ? faq.questionAr : faq.question,
          answer: lng === "ar" ? faq.answerAr : faq.answer,
        })) || [],
    };

    return transformedAboutus;
  }

  public async getOneForDashboard(req: Request) {
    let aboutus: any = await this.service.findOne({
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

    if (!aboutus) return null;
    aboutus = aboutus.toJSON() as IAboutus;
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

  public async getAll(req: Request) {
    const { limit, offset, order, orderBy } = handlePaginationSort(req.query);
    let { search } = req.query;
    const lng = req.language;

    // Define language-specific column mappings
    const columns = {
      ourMessage: lng === "ar" ? "ourMessageAr" : "ourMessage",
      ourVision: lng === "ar" ? "ourVisionAr" : "ourVision",
      whoAreWe: lng === "ar" ? "whoAreWeAr" : "whoAreWe",
    };

    const options: any = {
      attributes: [
        "id",
        [sequelize.col(`${columns.ourMessage}`), "ourMessage"],
        [sequelize.col(`${columns.ourVision}`), "ourVision"],
        [sequelize.col(`${columns.whoAreWe}`), "whoAreWe"],
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
        [Op.or]: [
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col(columns.ourMessage)),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col(columns.ourVision)),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
          sequelize.where(
            sequelize.fn("LOWER", sequelize.col(columns.whoAreWe)),
            { [Op.like]: `%${search.toLowerCase()}%` }
          ),
        ],
      };
    }

    const { rows, count } = await this.service.getAll(options);

    // Transform FAQs to match the language preference
    const transformedData = {
      count,
      rows: rows.map((row: any) => ({
        ...row.toJSON(),
        faqs:
          row.faqs?.map((faq: any) => ({
            id: faq.id,
            question: lng === "ar" ? faq.questionAr : faq.question,
            answer: lng === "ar" ? faq.answerAr : faq.answer,
          })) || [],
      })),
    };

    return transformedData;
  }
  public async updateFaqs(req: Request) {
    const { id } = req.params;
    const { faqs } = req.body;

    validateUUID(id, "invalid aboutus id");

    // Find the aboutus entry first
    const aboutus = await this.service.findOneByIdOrThrowError(id);

    // Update just the FAQs
    const updatedAboutus = await aboutus.update({ faqs });

    return updatedAboutus;
  }
}

export default AboutusController;
