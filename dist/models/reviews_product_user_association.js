"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("./users.model"));
const products_model_1 = __importDefault(require("./products.model"));
const review_model_1 = __importDefault(require("./review.model"));
users_model_1.default.hasMany(review_model_1.default, {
    foreignKey: { name: "userId" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
review_model_1.default.belongsTo(users_model_1.default, {
    foreignKey: { name: "userId" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
products_model_1.default.hasMany(review_model_1.default, {
    foreignKey: { name: "productId" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
review_model_1.default.belongsTo(products_model_1.default, {
    foreignKey: { name: "productId" },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
