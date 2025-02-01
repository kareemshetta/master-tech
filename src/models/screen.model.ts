import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";

class Screen extends Model {}

Screen.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    size: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    refreshRate: {
      type: DataTypes.STRING,
    },
    pixelDensity: {
      type: DataTypes.STRING,
    },
    aspectRatio: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "screens",
    paranoid: true,
    timestamps: true,
  }
);

export default Screen;
