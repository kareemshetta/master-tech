import CartItem from "./cartItem.model";
import { ProductSku } from "./product_skus.model";

ProductSku.hasMany(CartItem, {
  //   as: "sku",
  foreignKey: "skuId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
CartItem.belongsTo(ProductSku, {
  //   as: "cartItem",
  foreignKey: "skuId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
