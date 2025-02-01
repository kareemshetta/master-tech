import Product from "./products.model";
import Brand from "./brands.model";

Brand.hasMany(Product, {
  foreignKey: { name: "brandId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.belongsTo(Brand, {
  foreignKey: { name: "brandId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
