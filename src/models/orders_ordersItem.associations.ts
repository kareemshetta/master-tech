import User from "./users.model";
import Order from "./orders.model";
import OrderItem from "./orderItem.model";
import Product from "./products.model";
import { ProductSku } from "./product_skus.model";
import Store from "./stores.model";

User.hasMany(Order, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Order.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.hasMany(OrderItem, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ProductSku.hasMany(OrderItem, {
  //   as: "sku",
  foreignKey: { name: "skuId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
OrderItem.belongsTo(ProductSku, {
  //   as: "cartItem",
  foreignKey: { name: "skuId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Store.hasMany(Order, {
  foreignKey: "storeId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Order.belongsTo(Store, {
  foreignKey: "storeId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
