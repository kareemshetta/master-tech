"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepository_1 = require("../../../utils/baseRepository");
const product_skus_model_1 = require("../../../models/product_skus.model");
class ProductSkuRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(product_skus_model_1.ProductSku);
    }
    static getInstance() {
        if (!ProductSkuRepository.instance) {
            ProductSkuRepository.instance = new ProductSkuRepository();
        }
        return ProductSkuRepository.instance;
    }
}
ProductSkuRepository.instance = null;
exports.default = ProductSkuRepository;
