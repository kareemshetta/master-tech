import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";
class Processor extends Model {}

Processor.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    noOfCores: {
      type: DataTypes.STRING,
    },
    details: {
      type: DataTypes.TEXT,
    },
  },
  { sequelize, tableName: "processors", paranoid: true, timestamps: true }
);

export default Processor;
