import { DataTypes, Model } from "sequelize";
import User from "./users.model";
import sequelize from "../config/db/config";

class Order extends Model {}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    phoneNumber: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM,
      values: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      defaultValue: "PENDING",
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM,
      values: ["PENDING", "PAID", "FAILED"],
      defaultValue: "PENDING",
    },
  },
  {
    sequelize,
    modelName: "orders",
    paranoid: true,
    timestamps: true,
  }
);

export default Order;
