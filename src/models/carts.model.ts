import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";
import User from "./users.model";

class Cart extends Model {}

Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "carts",
    paranoid: true,
    timestamps: true,
  }
);

export default Cart;
