import ProductAttribute from "./product_attributes.model";
import { ProductSku } from "./product_skus.model";

ProductSku.belongsTo(ProductAttribute, {
  foreignKey: "storageAttributeId",
  as: "storage",
});
ProductSku.belongsTo(ProductAttribute, {
  foreignKey: "colorAttributeId",
  as: "color",
});

ProductAttribute.hasMany(ProductSku, {
  foreignKey: "storageAttributeId",
  as: "storageSkus",
});
ProductAttribute.hasMany(ProductSku, {
  foreignKey: "colorAttributeId",
  as: "colorSkus",
});
