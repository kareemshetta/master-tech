"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_attributes_model_1 = __importDefault(require("./product_attributes.model"));
const product_skus_model_1 = require("./product_skus.model");
product_skus_model_1.ProductSku.belongsTo(product_attributes_model_1.default, {
    foreignKey: "storageAttributeId",
    as: "storage",
});
product_skus_model_1.ProductSku.belongsTo(product_attributes_model_1.default, {
    foreignKey: "colorAttributeId",
    as: "color",
});
product_attributes_model_1.default.hasMany(product_skus_model_1.ProductSku, {
    foreignKey: "storageAttributeId",
    as: "storageSkus",
});
product_attributes_model_1.default.hasMany(product_skus_model_1.ProductSku, {
    foreignKey: "colorAttributeId",
    as: "colorSkus",
});
