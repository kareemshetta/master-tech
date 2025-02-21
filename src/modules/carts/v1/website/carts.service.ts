import {
  CreateOptions,
  FindAndCountOptions,
  FindOptions,
  UpdateOptions,
} from "sequelize";
import { ICartItem, Iuser } from "../../../../utils/shared.types";
import UserRepository from "../../../users/v1/users.repository";
import Joi from "joi";
import {
  PASSWORD_VALIDATION,
  PHONE_NUMBER_VALIDATION,
} from "../../../../utils/constant";
import { AppError, ValidationError } from "../../../../utils/appError";
import { UserStatus } from "../../../../utils/enums";
import CartRepo from "../../../carts/v1/carts.repository";
import Cart from "../../../../models/carts.model";
import CartItemRepo from "../cartItem.repository";

export class CartService {
  private static instance: CartService | null = null;
  private userRepository: UserRepository;
  private cartRepo: CartRepo;
  private cartItemRepo: CartItemRepo;

  private constructor() {
    this.userRepository = UserRepository.getInstance();
    this.cartRepo = CartRepo.getInstance();
    this.cartItemRepo = CartItemRepo.getInstance();
  }

  public static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  public async createCartItem(data: ICartItem, options?: CreateOptions) {
    return this.cartItemRepo.create(data, options);
  }
  public async updateCartItem(data: object, options: UpdateOptions) {
    return this.cartItemRepo.update(data, options); // TODO: update cart item
  }

  public async delete(userId: string) {
    return this.cartItemRepo.delete({ where: { id: userId } });
  }

  public async findOneByIdOrThrowError(
    trainerId: string,
    options: FindOptions = {}
  ) {
    return this.cartItemRepo.findOneByIdOrThrowError(trainerId, options);
  }

  public async updateOne(data: object, options: UpdateOptions) {
    return this.cartItemRepo.update(data, options);
  }

  public async findOne(options: FindOptions = {}) {
    return this.cartItemRepo.findOne(options);
  }

  public async getAll(options: FindAndCountOptions = {}) {
    return this.cartItemRepo.findAndCountAll(options);
  }
  public async createCart(userId: string, options?: CreateOptions) {
    return this.cartRepo.create(
      {
        userId,
      },
      options
    );
  }

  public async getCart(options: FindOptions) {
    return this.cartRepo.findOne(options);
  }

  public validateCreateItem(data: Iuser) {
    const schema = Joi.object({
      cartId: Joi.string().uuid().required(),
      productId: Joi.string().uuid().required(),
      skuId: Joi.string().uuid().allow(null),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
    });
    const { error } = schema.validate(data);
    if (error) {
      throw new ValidationError(error.message);
    }
    return;
  }

  public validateUpdateItem(data: Iuser) {
    const schema = Joi.object({
      id: Joi.string().uuid().required(),

      price: Joi.number().required(),
      quantity: Joi.number().required(),
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
}

export default CartService;
