"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admins_model_1 = __importDefault(require("./admins.model"));
const stores_model_1 = __importDefault(require("./stores.model"));
stores_model_1.default.hasMany(admins_model_1.default, { foreignKey: "storeId" });
admins_model_1.default.belongsTo(stores_model_1.default, { foreignKey: "storeId" });
