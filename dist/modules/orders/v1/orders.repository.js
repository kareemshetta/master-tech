"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const orders_model_1 = __importDefault(require("../../../models/orders.model"));
class OrderRepo extends baseRepository_1.BaseRepository {
    constructor() {
        super(orders_model_1.default);
    }
    static getInstance() {
        if (!OrderRepo.instance) {
            OrderRepo.instance = new OrderRepo();
        }
        return OrderRepo.instance;
    }
}
OrderRepo.instance = null;
exports.default = OrderRepo;
