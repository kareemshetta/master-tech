import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";
import { ProductAttributesEnum } from "../utils/enums";

class ProductAttribute extends Model {}

ProductAttribute.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(ProductAttributesEnum)),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      set(value: string) {
        if (value) {
          // Only set if a value is provided
          this.setDataValue("value", value.toLowerCase());
        }
      },
    },
  },
  {
    sequelize,
    modelName: "product_attributes",
    paranoid: true,
    timestamps: true,
    indexes: [
      { fields: ["type"], name: "attributes_type_idx" },
      { fields: ["value"], name: "attributes_value_idx" },
    ],
  }
);

export default ProductAttribute;
