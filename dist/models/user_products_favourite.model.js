"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
const users_model_1 = __importDefault(require("./users.model"));
const products_model_1 = __importDefault(require("./products.model"));
// Junction table model for user favorites
class UserFavorite extends sequelize_1.Model {
}
UserFavorite.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: users_model_1.default,
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
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: config_1.default,
    tableName: "userFavorites",
    timestamps: true,
    paranoid: true,
    indexes: [
        { name: "favourite_userId_idx", fields: ["userId"] },
        { name: "favourite_productId_idx", fields: ["productId"] },
    ],
});
exports.default = UserFavorite;
