import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    image: {
      type: DataTypes.STRING,
      // allowNull: false,
      defaultValue: "/uploads/avatar.jpg",
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
      allowNull: true,
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "categories",
    paranoid: true,
    timestamps: true,
    indexes: [
      { fields: ["name"], name: "category_name_idx" },
      { fields: ["nameAr"], name: "category_nameAr_idx" },
      { fields: ["description"], name: "category_description_idx" },
    ],
  }
);

export default Category;
