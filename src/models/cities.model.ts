import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";

class City extends Model {}

City.init(
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
    modelName: "cities",
    paranoid: true,
    timestamps: true,
    indexes: [
      { fields: ["name"], name: "city_name_idx" },
      { fields: ["nameAr"], name: "city_nameAr_idx" },
    ],
  }
);

export default City;
