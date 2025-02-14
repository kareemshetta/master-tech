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
    nameAr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
    },

    description: {
      type: DataTypes.STRING,
    },
    descriptionAr: {
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
    allowShipping: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    paranoid: true,
    modelName: "stores",
    indexes: [
      { fields: ["name"], name: "store_name_idx" },
      { fields: ["description"], name: "store_description_idx" },
      { fields: ["descriptionAr"], name: "store_descriptionAr_idx" },
      { fields: ["nameAr"], name: "store_nameAr_idx" },
      { fields: ["phoneNumber"], name: "store_phone_idx" },
    ],
  }
);

export default Store;
