"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
class City extends sequelize_1.Model {
}
City.init({
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
}, {
    sequelize: config_1.default,
    modelName: "cities",
    paranoid: true,
    timestamps: true,
    indexes: [
        { fields: ["name"], name: "city_name_idx" },
        { fields: ["nameAr"], name: "city_nameAr_idx" },
    ],
});
exports.default = City;
