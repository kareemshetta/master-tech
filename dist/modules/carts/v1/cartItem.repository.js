"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const cartItem_model_1 = __importDefault(require("../../../models/cartItem.model"));
class CartItemRepo extends baseRepository_1.BaseRepository {
    constructor() {
        super(cartItem_model_1.default);
    }
    static getInstance() {
        if (!CartItemRepo.instance) {
            CartItemRepo.instance = new CartItemRepo();
        }
        return CartItemRepo.instance;
    }
}
CartItemRepo.instance = null;
exports.default = CartItemRepo;
