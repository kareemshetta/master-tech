import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";

class Home extends Model {}

Home.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    titleAr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sections: { type: DataTypes.ARRAY(DataTypes.JSONB) },
  },
  {
    sequelize,
    modelName: "home",
    paranoid: true,
    timestamps: true,
  }
);

export default Home;
