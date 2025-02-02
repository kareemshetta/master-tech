"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
const enums_1 = require("../utils/enums");
class ProductAttribute extends sequelize_1.Model {
}
ProductAttribute.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(enums_1.ProductAttributesEnum)),
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.STRING,
        set(value) {
            if (value) {
                // Only set if a value is provided
                this.setDataValue("value", value.toLowerCase());
            }
        },
    },
}, {
    sequelize: config_1.default,
    modelName: "product_attributes",
    paranoid: true,
    timestamps: true,
    indexes: [
        { fields: ["type"], name: "attributes_type_idx" },
        { fields: ["value"], name: "attributes_value_idx" },
    ],
});
exports.default = ProductAttribute;
