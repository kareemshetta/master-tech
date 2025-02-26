"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
const enums_1 = require("../utils/enums");
class Product extends sequelize_1.Model {
}
Product.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    nameAr: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
    },
    categoryType: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: enums_1.CategoryType.LAPTOP,
    },
    descriptionAr: {
        type: sequelize_1.DataTypes.TEXT,
    },
    basePrice: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2), // Default price without store-specific variations
    },
    discount: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
    image: {
        type: sequelize_1.DataTypes.STRING, // URL for the main product image
    },
    grantee: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "1 year ",
    },
    battery: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    ram: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    images: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING) },
    quantity: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
}, { sequelize: config_1.default, tableName: "products", paranoid: true, timestamps: true });
exports.default = Product;
