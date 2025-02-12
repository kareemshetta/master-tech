"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stores_model_1 = __importDefault(require("./stores.model"));
const cities_model_1 = __importDefault(require("./cities.model"));
const regions_model_1 = __importDefault(require("./regions.model"));
cities_model_1.default.hasMany(stores_model_1.default, {
    foreignKey: { name: "cityId", allowNull: true },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
regions_model_1.default.hasMany(stores_model_1.default, {
    foreignKey: { name: "regionId", allowNull: true },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
stores_model_1.default.belongsTo(cities_model_1.default, {
    foreignKey: { name: "cityId", allowNull: true },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
stores_model_1.default.belongsTo(regions_model_1.default, {
    foreignKey: { name: "regionId", allowNull: true },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
