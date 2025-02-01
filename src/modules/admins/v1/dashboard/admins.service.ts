import { FindAndCountOptions, FindOptions } from "sequelize";
import { IAdmin } from "../../../../utils/shared.types";
import AdminRepository from "../admins.repository";
import Joi from "joi";
import {
  PASSWORD_VALIDATION,
  PHONE_NUMBER_VALIDATION,
} from "../../../../utils/constant";
import { AppError, ValidationError } from "../../../../utils/appError";
import { UserStatus } from "../../../../utils/enums";

export class AdminService {
  private static instance: AdminService | null = null;
  private userRepository: AdminRepository;

  private constructor() {
    this.userRepository = AdminRepository.getInstance();
  }

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  public async create(data: IAdmin) {
    return this.userRepository.create(data);
  }

  public async delete(userId: string) {
    return this.userRepository.delete({ where: { id: userId } });
  }

  public async findOneByIdOrThrowError(
    trainerId: string,
    options: FindOptions = {}
  ) {
    return this.userRepository.findOneByIdOrThrowError(trainerId, options);
  }

  public async findOne(options: FindOptions = {}) {
    return this.userRepository.findOne(options);
  }

  public async getAll(options: FindAndCountOptions = {}) {
    return this.userRepository.findAndCountAll(options);
  }

  public validateCreateUser(data: IAdmin) {
    const schema = Joi.object({
      image: Joi.string()
        .trim()
        .regex(/\.(jpg|jpeg|png|HEIF|svg)$/i)
        .messages({
          "string.base": "image must be a string.",
          "string.empty": "image cannot be empty.",
          "string.uri": "image must be a valid URI.",
          "string.pattern.base":
            "image must have a valid file extension (jpg, jpeg, png).",
          "any.required": "image is required and cannot be null.",
        })
        .required(),
      firstName: Joi.string().trim().max(50).min(1).required(),
      lastName: Joi.string().trim().max(50).min(1).required(),
      email: Joi.string().max(255).email().required(),
      phoneNumber: Joi.string()
        .regex(PHONE_NUMBER_VALIDATION)
        .required()
        .messages({
          "string.base": "phoneNumber must be a string.",
          "string.empty": "phoneNumber cannot be empty.",
          "string.pattern.base": "Please enter a valid Phone Number.",
          "any.required": "phoneNumber is required and cannot be null.",
        }),

      gender: Joi.string().valid("MALE", "FEMALE", "OTHER").allow(""),
      birthDate: Joi.date().iso().allow(""),

      password: Joi.string()
        .regex(PASSWORD_VALIDATION)
        .min(8)
        .messages({
          "string.base": "Password must be a string.",
          "string.empty": "Password cannot be empty.",
          "string.min": "Password must be at least 8 characters long.",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, and one special character.",
          "any.required": "Password is required and cannot be null.",
        })
        .required(),
      confirmPassword: Joi.string()
        .equal(Joi.ref("password"))
        .regex(PASSWORD_VALIDATION)
        .required()
        .min(8)
        .messages({
          "string.base": "Password must be a string.",
          "string.empty": "Password cannot be empty.",
          "string.min": "Password must be at least 8 characters long.",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, and one special character.",
          "any.required": "Password is required and cannot be null.",
        }),
    });
    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateLoginUser(data: IAdmin) {
    const schema = Joi.object({
      email: Joi.string().max(255).email().required(),

      password: Joi.string()
        .regex(PASSWORD_VALIDATION)
        .min(8)
        .messages({
          "string.base": "Password must be a string.",
          "string.empty": "Password cannot be empty.",
          "string.min": "Password must be at least 8 characters long.",
          "string.pattern.base":
            "Password must contain at least one uppercase letter, one lowercase letter, and one special character.",
          "any.required": "Password is required and cannot be null.",
        })
        .required(),
    });
    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }
}

export default AdminService;
