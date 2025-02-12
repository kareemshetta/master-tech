"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
class Category extends sequelize_1.Model {
}
Category.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false,
        defaultValue: "/uploads/avatar.jpg",
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
        allowNull: true,
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: config_1.default,
    modelName: "categories",
    paranoid: true,
    timestamps: true,
    indexes: [
        { fields: ["name"], name: "category_name_idx" },
        { fields: ["nameAr"], name: "category_nameAr_idx" },
        { fields: ["description"], name: "category_description_idx" },
    ],
});
exports.default = Category;
