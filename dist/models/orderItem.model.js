"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
const carts_model_1 = __importDefault(require("./carts.model"));
const products_model_1 = __importDefault(require("./products.model"));
class OrderItem extends sequelize_1.Model {
}
OrderItem.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    cartId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: carts_model_1.default,
            key: "id",
        },
    },
    productId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: products_model_1.default,
            key: "id",
        },
    },
}, {
    sequelize: config_1.default,
    modelName: "order_items",
    paranoid: true,
    timestamps: true,
});
exports.default = OrderItem;
