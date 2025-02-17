import { FindAndCountOptions, FindOptions } from "sequelize";
import Joi from "joi";
import { ValidationError } from "../../../../utils/appError";
import HomeRepository from "../home.repository";
import { IHome } from "../../../../utils/shared.types";

export class HomeService {
  private static instance: HomeService | null = null;
  private repo: HomeRepository;

  private constructor() {
    this.repo = HomeRepository.getInstance();
  }

  public static getInstance(): HomeService {
    if (!HomeService.instance) {
      HomeService.instance = new HomeService();
    }
    return HomeService.instance;
  }

  public async create(data: IHome) {
    this.validateCreate(data);
    return this.repo.create(data);
  }

  public async update(id: string, data: Partial<IHome>) {
    this.validateUpdate(data);
    return this.repo.update(data, { where: { id } });
  }

  public async delete(id: string) {
    return this.repo.delete({ where: { id } });
  }

  public async findOneByIdOrThrowError(id: string, options: FindOptions = {}) {
    return this.repo.findOneByIdOrThrowError(id, options);
  }

  public async findOne(options: FindOptions = {}) {
    return this.repo.findOne(options);
  }

  public async getAll(options: FindAndCountOptions = {}) {
    return this.repo.findAndCountAll(options);
  }

  private getSectionValidationSchema() {
    return Joi.array().items(
      Joi.object({
        title: Joi.string().trim().required().messages({
          "string.base": "Section title must be a string",
          "string.empty": "Section title cannot be empty",
          "any.required": "Section title is required",
        }),
        titleAr: Joi.string().trim().required().messages({
          "string.base": "Section title in Arabic must be a string",
          "string.empty": "Section title in Arabic cannot be empty",
          "any.required": "Section title in Arabic is required",
        }),
        subtitle: Joi.string().trim().required().messages({
          "string.base": "Section subtitle must be a string",
          "string.empty": "Section subtitle cannot be empty",
          "any.required": "Section subtitle is required",
        }),
        subtitleAr: Joi.string().trim().required().messages({
          "string.base": "Section subtitle in Arabic must be a string",
          "string.empty": "Section subtitle in Arabic cannot be empty",
          "any.required": "Section subtitle in Arabic is required",
        }),
        image: Joi.string()
          .trim()
          .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
          .messages({
            "string.base": "Image must be a string.",
            "string.empty": "Image cannot be empty.",
            "string.pattern.base":
              "Image must have a valid file extension (jpg, jpeg, png, HEIF, svg).",
            "any.required": "Image is required and cannot be null.",
          })
          .required(),
      })
    );
  }

  public validateCreate(data: IHome) {
    const schema = Joi.object({
      title: Joi.string().trim().required().messages({
        "string.base": "Title must be a string",
        "string.empty": "Title cannot be empty",
        "any.required": "Title is required",
      }),
      titleAr: Joi.string().trim().required().messages({
        "string.base": "Title in Arabic must be a string",
        "string.empty": "Title in Arabic cannot be empty",
        "any.required": "Title in Arabic is required",
      }),

      sections: this.getSectionValidationSchema().required().messages({
        "any.required": "Sections are required",
      }),
    });

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateUpdate(data: Partial<IHome>) {
    const schema = Joi.object({
      title: Joi.string().trim(),
      titleAr: Joi.string().trim(),

      sections: this.getSectionValidationSchema(),
    }).min(1);

    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }
}

export default HomeService;
