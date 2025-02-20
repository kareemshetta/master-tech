"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const users_model_1 = __importDefault(require("./users.model"));
const config_1 = __importDefault(require("../config/db/config"));
const generalFunctions_1 = require("../utils/generalFunctions");
class Order extends sequelize_1.Model {
}
Order.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: users_model_1.default,
            key: "id",
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
        defaultValue: "PENDING",
    },
    totalAmount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    shippingAddress: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    shortId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: (0, generalFunctions_1.generateOrderId)(8),
    },
    isDelivery: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["PENDING", "PAID", "FAILED"],
        defaultValue: "PENDING",
    },
}, {
    sequelize: config_1.default,
    modelName: "orders",
    paranoid: true,
    timestamps: true,
});
exports.default = Order;
