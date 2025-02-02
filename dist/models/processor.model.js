"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
class Processor extends sequelize_1.Model {
}
Processor.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    noOfCores: {
        type: sequelize_1.DataTypes.STRING,
    },
    details: {
        type: sequelize_1.DataTypes.TEXT,
    },
}, { sequelize: config_1.default, tableName: "processors", paranoid: true, timestamps: true });
exports.default = Processor;
