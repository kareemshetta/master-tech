import CartItem from "./cartItem.model";
import Cart from "./carts.model";

import Product from "./products.model";

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
CartItem.belongsTo(Cart, {
  foreignKey: "cartId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.hasMany(CartItem, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
CartItem.belongsTo(Product, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
