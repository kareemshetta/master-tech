import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";
import User from "./users.model";
import Product from "./products.model";

class Review extends Model {}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
        isInt: true,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
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
    modelName: "reviews",
    paranoid: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "productId"],
        name: "unique_user_product_review",
      },
    ],
  }
);

export default Review;
