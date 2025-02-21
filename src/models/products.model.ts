import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";
import { CategoryType } from "../utils/enums";
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
    categoryType: {
      type: DataTypes.STRING,
      defaultValue: CategoryType.LAPTOP,
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
    grantee: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "1 year ",
    },
    battery: {
      type: DataTypes.INTEGER,
    },
    ram: {
      type: DataTypes.INTEGER,
    },

    images: { type: DataTypes.ARRAY(DataTypes.STRING) },
    quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { sequelize, tableName: "products", paranoid: true, timestamps: true }
);

export default Product;
