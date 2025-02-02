"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
class Screen extends sequelize_1.Model {
}
Screen.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    size: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false,
    },
    refreshRate: {
        type: sequelize_1.DataTypes.STRING,
    },
    pixelDensity: {
        type: sequelize_1.DataTypes.STRING,
    },
    aspectRatio: {
        type: sequelize_1.DataTypes.STRING,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
    },
    details: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: config_1.default,
    modelName: "screens",
    paranoid: true,
    timestamps: true,
});
exports.default = Screen;
