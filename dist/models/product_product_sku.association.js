"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_skus_model_1 = require("./product_skus.model");
const products_model_1 = __importDefault(require("./products.model"));
products_model_1.default.hasMany(product_skus_model_1.ProductSku, { foreignKey: "productId", as: "skus" });
product_skus_model_1.ProductSku.belongsTo(products_model_1.default, { foreignKey: "productId", as: "product" });
