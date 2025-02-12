"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const carts_model_1 = __importDefault(require("./carts.model"));
const users_model_1 = __importDefault(require("./users.model"));
users_model_1.default.hasOne(carts_model_1.default, {
    foreignKey: { name: "userId", allowNull: true },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
carts_model_1.default.belongsTo(users_model_1.default, {
    foreignKey: { name: "userId", allowNull: true },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
