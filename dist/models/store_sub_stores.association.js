"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stores_model_1 = __importDefault(require("./stores.model"));
// Self-referential relationships
stores_model_1.default.hasMany(stores_model_1.default, { foreignKey: "parentId", as: "subStores" });
stores_model_1.default.belongsTo(stores_model_1.default, { foreignKey: "parentId", as: "parentStore" });
