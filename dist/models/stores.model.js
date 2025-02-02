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
    location: {
        type: sequelize_1.DataTypes.STRING,
    },
    description: {
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
}, {
    sequelize: config_1.default,
    modelName: "stores",
    indexes: [
        { fields: ["name"], name: "store_name_idx" },
        { fields: ["phoneNumber"], name: "store_phone_idx" },
    ],
});
exports.default = Store;
