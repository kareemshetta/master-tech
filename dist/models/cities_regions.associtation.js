"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cities_model_1 = __importDefault(require("./cities.model"));
const regions_model_1 = __importDefault(require("./regions.model"));
cities_model_1.default.hasMany(regions_model_1.default, {
    foreignKey: "cityId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
regions_model_1.default.belongsTo(cities_model_1.default, {
    foreignKey: "cityId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
