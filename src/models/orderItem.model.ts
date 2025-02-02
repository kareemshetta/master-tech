import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";

import Cart from "./carts.model";
import Product from "./products.model";

class OrderItem extends Model {}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Cart,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "order_items",
    paranoid: true,
    timestamps: true,
  }
);

export default OrderItem;
