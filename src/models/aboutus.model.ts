import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";

class Aboutus extends Model {}

Aboutus.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    ourMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ourMessageAr: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ourVision: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ourVisionAr: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    whoAreWe: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    whoAreWeAr: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    faqs: { type: DataTypes.ARRAY(DataTypes.JSONB) },
  },
  {
    sequelize,
    modelName: "aboutus",
    paranoid: true,
    timestamps: true,
    indexes: [
      { fields: ["whoAreWe"], name: "aboutus_whoAreWe_idx" },
      { fields: ["whoAreWeAr"], name: "aboutus_whoAreWeAr_idx" },
    ],
  }
);

export default Aboutus;
