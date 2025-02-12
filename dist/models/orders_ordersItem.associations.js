"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("./users.model"));
const orders_model_1 = __importDefault(require("./orders.model"));
const orderItem_model_1 = __importDefault(require("./orderItem.model"));
const products_model_1 = __importDefault(require("./products.model"));
const product_skus_model_1 = require("./product_skus.model");
const stores_model_1 = __importDefault(require("./stores.model"));
users_model_1.default.hasMany(orders_model_1.default, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
orders_model_1.default.belongsTo(users_model_1.default, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
orders_model_1.default.hasMany(orderItem_model_1.default, {
    foreignKey: "orderId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
orderItem_model_1.default.belongsTo(orders_model_1.default, {
    foreignKey: "orderId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
products_model_1.default.hasMany(orderItem_model_1.default, {
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
orderItem_model_1.default.belongsTo(products_model_1.default, {
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
product_skus_model_1.ProductSku.hasMany(orderItem_model_1.default, {
    //   as: "sku",
    foreignKey: "skuId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
orderItem_model_1.default.belongsTo(product_skus_model_1.ProductSku, {
    //   as: "cartItem",
    foreignKey: "skuId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
stores_model_1.default.hasMany(orders_model_1.default, {
    foreignKey: "storeId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
orders_model_1.default.belongsTo(stores_model_1.default, {
    foreignKey: "storeId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
