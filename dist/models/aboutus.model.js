"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
class Aboutus extends sequelize_1.Model {
}
Aboutus.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    ourMessage: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    ourMessageAr: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    ourVision: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    ourVisionAr: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    whoAreWe: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    whoAreWeAr: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    faqs: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSONB) },
}, {
    sequelize: config_1.default,
    modelName: "aboutus",
    paranoid: true,
    timestamps: true,
    indexes: [
        { fields: ["whoAreWe"], name: "aboutus_whoAreWe_idx" },
        { fields: ["whoAreWeAr"], name: "aboutus_whoAreWeAr_idx" },
    ],
});
exports.default = Aboutus;
