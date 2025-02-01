import {
  CreateOptions,
  FindAndCountOptions,
  FindOptions,
  UpdateOptions,
} from "sequelize";
import { Iuser } from "../../../../utils/shared.types";
import UserRepository from "../users.repository";
import Joi from "joi";
import {
  PASSWORD_VALIDATION,
  PHONE_NUMBER_VALIDATION,
} from "../../../../utils/constant";
import { AppError, ValidationError } from "../../../../utils/appError";
import { UserStatus } from "../../../../utils/enums";
import CartRepo from "../../../carts/v1/carts.repository";

export class UserService {
  private static instance: UserService | null = null;
  private userRepository: UserRepository;
  private cartRepo: CartRepo;

  private constructor() {
    this.userRepository = UserRepository.getInstance();
    this.cartRepo = CartRepo.getInstance();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async create(data: Iuser, options?: CreateOptions) {
    return this.userRepository.create(data, options);
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

  public async updateOne(data: object, options: UpdateOptions) {
    return this.userRepository.update(data, options);
  }

  public async findOne(options: FindOptions = {}) {
    return this.userRepository.findOne(options);
  }

  public async getAll(options: FindAndCountOptions = {}) {
    return this.userRepository.findAndCountAll(options);
  }
  public async createCart(userId: string, options?: CreateOptions) {
    return this.cartRepo.create(
      {
        userId,
      },
      options
    );
  }

  public validateCreateUser(data: Iuser) {
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

  public validateLoginUser(data: Iuser) {
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

  public validateEmail(email: string) {
    const schema = Joi.string().max(255).email().required();

    const { error } = schema.validate(email);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateVerifyOtp(data: Iuser) {
    const schema = Joi.object({
      email: Joi.string().max(255).email().required(),
      otp: Joi.string().required(),
    });
    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  // public validateUpdateOtp(data: Iuser) {
  //   const schema = Joi.object({
  //     email: Joi.string().max(255).email().required(),
  //     otp: Joi.string().required(),
  //   });
  //   const { error } = schema.validate(data);
  //   if (error) {
  //     throw new ValidationError(error.message);
  //   }
  //   return;
  // }

  public validateUpdatePassword(data: Iuser) {
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

      confirmPassword: Joi.string()
        .equal(Joi.ref("password"))
        .regex(PASSWORD_VALIDATION)
        .required()
        .min(8)
        .messages({
          "string.base": "confirmPassword must be a string.",
          "string.empty": "confirmPassword cannot be empty.",
          "string.min": "confirmPassword must be at least 8 characters long.",
          "string.pattern.base":
            "confirmPassword must contain at least one uppercase letter, one lowercase letter, and one special character.",
          "any.required": "confirmPassword is required and cannot be null.",
        }),
      otp: Joi.string().required(),
    });
    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }
}

export default UserService;
