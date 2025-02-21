"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const users_repository_1 = __importDefault(require("../../../users/v1/users.repository"));
const joi_1 = __importDefault(require("joi"));
const appError_1 = require("../../../../utils/appError");
const carts_repository_1 = __importDefault(require("../../../carts/v1/carts.repository"));
const cartItem_repository_1 = __importDefault(require("../cartItem.repository"));
class CartService {
    constructor() {
        this.userRepository = users_repository_1.default.getInstance();
        this.cartRepo = carts_repository_1.default.getInstance();
        this.cartItemRepo = cartItem_repository_1.default.getInstance();
    }
    static getInstance() {
        if (!CartService.instance) {
            CartService.instance = new CartService();
        }
        return CartService.instance;
    }
    async createCartItem(data, options) {
        return this.cartItemRepo.create(data, options);
    }
    async updateCartItem(data, options) {
        return this.cartItemRepo.update(data, options); // TODO: update cart item
    }
    async delete(userId) {
        return this.cartItemRepo.delete({ where: { id: userId } });
    }
    async findOneByIdOrThrowError(trainerId, options = {}) {
        return this.cartItemRepo.findOneByIdOrThrowError(trainerId, options);
    }
    async updateOne(data, options) {
        return this.cartItemRepo.update(data, options);
    }
    async findOne(options = {}) {
        return this.cartItemRepo.findOne(options);
    }
    async getAll(options = {}) {
        return this.cartItemRepo.findAndCountAll(options);
    }
    async createCart(userId, options) {
        return this.cartRepo.create({
            userId,
        }, options);
    }
    async getCart(options) {
        return this.cartRepo.findOne(options);
    }
    validateCreateItem(data) {
        const schema = joi_1.default.object({
            cartId: joi_1.default.string().uuid().required(),
            productId: joi_1.default.string().uuid().required(),
            skuId: joi_1.default.string().uuid().allow(null),
            price: joi_1.default.number().required(),
            quantity: joi_1.default.number().required(),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateUpdateItem(data) {
        const schema = joi_1.default.object({
            id: joi_1.default.string().uuid().required(),
            price: joi_1.default.number().required(),
            quantity: joi_1.default.number().required(),
        });
        const { error } = schema.validate(data);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
    validateEmail(email) {
        const schema = joi_1.default.string().max(255).email().required();
        const { error } = schema.validate(email);
        if (error) {
            throw new appError_1.ValidationError(error.message);
        }
        return;
    }
}
exports.CartService = CartService;
CartService.instance = null;
exports.default = CartService;
