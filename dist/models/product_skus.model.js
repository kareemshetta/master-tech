"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSku = void 0;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
class ProductSku extends sequelize_1.Model {
}
exports.ProductSku = ProductSku;
ProductSku.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    sku: sequelize_1.DataTypes.STRING,
    price: sequelize_1.DataTypes.DECIMAL(10, 2), // Use DECIMAL for prices
    quantity: sequelize_1.DataTypes.INTEGER,
}, {
    sequelize: config_1.default,
    modelName: "product_skus",
    timestamps: true,
    paranoid: true,
});
