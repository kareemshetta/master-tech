import User from "./users.model";
import Product from "./products.model";
import UserFavorite from "./user_products_favourite.model";

User.belongsToMany(Product, {
  through: UserFavorite,
  //   as: "favoriteProducts",
  foreignKey: "userId",
  otherKey: "productId",
});

Product.belongsToMany(User, {
  through: UserFavorite,
  //   as: "favoritedBy",
  foreignKey: "productId",
  otherKey: "userId",
});
