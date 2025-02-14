"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
class Store extends sequelize_1.Model {
}
Store.init({
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
    location: {
        type: sequelize_1.DataTypes.STRING,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    descriptionAr: {
        type: sequelize_1.DataTypes.STRING,
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
    },
    parentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: "stores",
            key: "id",
        },
    },
    allowShipping: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: config_1.default,
    paranoid: true,
    modelName: "stores",
    indexes: [
        { fields: ["name"], name: "store_name_idx" },
        { fields: ["description"], name: "store_description_idx" },
        { fields: ["descriptionAr"], name: "store_descriptionAr_idx" },
        { fields: ["nameAr"], name: "store_nameAr_idx" },
        { fields: ["phoneNumber"], name: "store_phone_idx" },
    ],
});
exports.default = Store;
