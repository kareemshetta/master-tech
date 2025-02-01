import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";

export class ProductSku extends Model {}

ProductSku.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    sku: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2), // Use DECIMAL for prices
    quantity: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "product_skus",
    timestamps: true,
    paranoid: true,
  }
);
