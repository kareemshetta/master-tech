"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const orderItem_model_1 = __importDefault(require("../../../models/orderItem.model"));
class OrderItemRepo extends baseRepository_1.BaseRepository {
    constructor() {
        super(orderItem_model_1.default);
    }
    static getInstance() {
        if (!OrderItemRepo.instance) {
            OrderItemRepo.instance = new OrderItemRepo();
        }
        return OrderItemRepo.instance;
    }
}
OrderItemRepo.instance = null;
exports.default = OrderItemRepo;
