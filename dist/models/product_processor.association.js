"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_model_1 = __importDefault(require("./products.model"));
const processor_model_1 = __importDefault(require("./processor.model"));
processor_model_1.default.hasOne(products_model_1.default, {
    foreignKey: { name: "processorId", allowNull: true },
    onDelete: "CASCADE",
});
products_model_1.default.belongsTo(processor_model_1.default, {
    foreignKey: { name: "processorId", allowNull: true },
    onUpdate: "CASCADE",
});
