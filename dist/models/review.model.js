"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
const users_model_1 = __importDefault(require("./users.model"));
const products_model_1 = __importDefault(require("./products.model"));
class Review extends sequelize_1.Model {
}
Review.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
            isInt: true,
        },
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
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
}, {
    sequelize: config_1.default,
    modelName: "reviews",
    paranoid: true,
    timestamps: true,
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ["userId", "productId"],
    //     name: "unique_user_product_review",
    //   },
    // ],
});
exports.default = Review;
