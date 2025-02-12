"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("./users.model"));
const products_model_1 = __importDefault(require("./products.model"));
const user_products_favourite_model_1 = __importDefault(require("./user_products_favourite.model"));
users_model_1.default.belongsToMany(products_model_1.default, {
    through: user_products_favourite_model_1.default,
    //   as: "favoriteProducts",
    foreignKey: "userId",
    otherKey: "productId",
});
products_model_1.default.belongsToMany(users_model_1.default, {
    through: user_products_favourite_model_1.default,
    //   as: "favoritedBy",
    foreignKey: "productId",
    otherKey: "userId",
});
