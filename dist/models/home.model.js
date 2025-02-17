"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
class Home extends sequelize_1.Model {
}
Home.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    titleAr: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    sections: { type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.JSONB) },
}, {
    sequelize: config_1.default,
    modelName: "home",
    paranoid: true,
    timestamps: true,
});
exports.default = Home;
