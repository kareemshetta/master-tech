import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";
class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameAr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    descriptionAr: {
      type: DataTypes.TEXT,
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2), // Default price without store-specific variations
    },
    discount: { type: DataTypes.INTEGER, defaultValue: 0 },
    image: {
      type: DataTypes.STRING, // URL for the main product image
    },
    battery: {
      type: DataTypes.INTEGER,
    },
    ram: {
      type: DataTypes.INTEGER,
    },

    images: { type: DataTypes.ARRAY(DataTypes.STRING) },
  },
  { sequelize, tableName: "products", paranoid: true, timestamps: true }
);

export default Product;
