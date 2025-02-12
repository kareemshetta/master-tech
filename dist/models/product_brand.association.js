"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_model_1 = __importDefault(require("./products.model"));
const brands_model_1 = __importDefault(require("./brands.model"));
brands_model_1.default.hasMany(products_model_1.default, {
    foreignKey: { name: "brandId", allowNull: true },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
products_model_1.default.belongsTo(brands_model_1.default, {
    foreignKey: { name: "brandId", allowNull: true },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
