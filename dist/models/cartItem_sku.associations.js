"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cartItem_model_1 = __importDefault(require("./cartItem.model"));
const product_skus_model_1 = require("./product_skus.model");
product_skus_model_1.ProductSku.hasMany(cartItem_model_1.default, {
    //   as: "sku",
    foreignKey: { name: "skuId", allowNull: true },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
cartItem_model_1.default.belongsTo(product_skus_model_1.ProductSku, {
    //   as: "cartItem",
    foreignKey: { name: "skuId", allowNull: true },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
