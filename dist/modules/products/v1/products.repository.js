"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const products_model_1 = __importDefault(require("../../../models/products.model"));
class ProductREpository extends baseRepository_1.BaseRepository {
    constructor() {
        super(products_model_1.default);
    }
    static getInstance() {
        if (!ProductREpository.instance) {
            ProductREpository.instance = new ProductREpository();
        }
        return ProductREpository.instance;
    }
}
ProductREpository.instance = null;
exports.default = ProductREpository;
