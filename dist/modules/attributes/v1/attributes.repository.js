"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const product_attributes_model_1 = __importDefault(require("../../../models/product_attributes.model"));
class ProductAttributesRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(product_attributes_model_1.default);
    }
    static getInstance() {
        if (!ProductAttributesRepository.instance) {
            ProductAttributesRepository.instance = new ProductAttributesRepository();
        }
        return ProductAttributesRepository.instance;
    }
}
ProductAttributesRepository.instance = null;
exports.default = ProductAttributesRepository;
