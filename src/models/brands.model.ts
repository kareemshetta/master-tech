import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";

class Brand extends Model {}

Brand.init(
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
  },
  {
    sequelize,
    modelName: "brands",
    paranoid: true,
    timestamps: true,
    indexes: [{ fields: ["name"], name: "brand_name_idx" }],
  }
);

export default Brand;
