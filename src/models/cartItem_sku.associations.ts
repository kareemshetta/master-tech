import CartItem from "./cartItem.model";
import { ProductSku } from "./product_skus.model";

ProductSku.hasMany(CartItem, {
  //   as: "sku",
  foreignKey: { name: "skuId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
CartItem.belongsTo(ProductSku, {
  //   as: "cartItem",
  foreignKey: { name: "skuId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
