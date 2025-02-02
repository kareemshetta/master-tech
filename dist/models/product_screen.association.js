"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_model_1 = __importDefault(require("./products.model"));
const screen_model_1 = __importDefault(require("./screen.model"));
// Self-referential relationships
screen_model_1.default.hasOne(products_model_1.default, {
    foreignKey: { name: "screenId", allowNull: true },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
products_model_1.default.belongsTo(screen_model_1.default, {
    foreignKey: { name: "screenId", allowNull: true },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
