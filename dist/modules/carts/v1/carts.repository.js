"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const carts_model_1 = __importDefault(require("../../../models/carts.model"));
class CartRepo extends baseRepository_1.BaseRepository {
    constructor() {
        super(carts_model_1.default);
    }
    static getInstance() {
        if (!CartRepo.instance) {
            CartRepo.instance = new CartRepo();
        }
        return CartRepo.instance;
    }
}
CartRepo.instance = null;
exports.default = CartRepo;
