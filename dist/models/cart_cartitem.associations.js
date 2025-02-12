"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cartItem_model_1 = __importDefault(require("./cartItem.model"));
const carts_model_1 = __importDefault(require("./carts.model"));
const products_model_1 = __importDefault(require("./products.model"));
carts_model_1.default.hasMany(cartItem_model_1.default, {
    foreignKey: "cartId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
cartItem_model_1.default.belongsTo(carts_model_1.default, {
    foreignKey: "cartId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
products_model_1.default.hasMany(cartItem_model_1.default, {
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
cartItem_model_1.default.belongsTo(products_model_1.default, {
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
