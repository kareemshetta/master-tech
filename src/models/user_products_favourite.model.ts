import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";
import User from "./users.model";
import Product from "./products.model";

// Junction table model for user favorites
class UserFavorite extends Model {
  public id?: string;
  public userId?: string;
  public productId?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;
}

UserFavorite.init(
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
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "userFavorites",
    timestamps: true,
    paranoid: true,
    indexes: [
      { name: "favourite_userId_idx", fields: ["userId"] },
      { name: "favourite_productId_idx", fields: ["productId"] },
    ],
  }
);

export default UserFavorite;
