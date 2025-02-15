import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";

class Region extends Model {}

Region.init(
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
  },
  {
    sequelize,
    modelName: "regions",
    paranoid: true,
    timestamps: true,
    indexes: [{ fields: ["name"], name: "region_name_idx" }],
  }
);

export default Region;
