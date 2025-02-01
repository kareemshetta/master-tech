import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";
import User from "./users.model";
import Cart from "./carts.model";
import Product from "./products.model";
import { ProductSku } from "./product_skus.model";

class CartItem extends Model {}

CartItem.init(
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
    // skuId: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: ProductSku,
    //     key: "id",
    //   },
    // },
  },
  {
    sequelize,
    modelName: "cart_items",
    paranoid: true,
    timestamps: true,
  }
);

export default CartItem;
