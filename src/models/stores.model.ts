import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";

class Store extends Model {}

Store.init(
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
    location: {
      type: DataTypes.STRING,
    },

    description: {
      type: DataTypes.STRING,
    },

    phoneNumber: {
      type: DataTypes.STRING,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "stores",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "stores",
    indexes: [
      { fields: ["name"], name: "store_name_idx" },
      { fields: ["phoneNumber"], name: "store_phone_idx" },
    ],
  }
);

export default Store;
