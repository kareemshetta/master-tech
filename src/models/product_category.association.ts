import Product from "./products.model";
import Category from "./categories.model";

Category.hasMany(Product, {
  foreignKey: { name: "categoryId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.belongsTo(Category, {
  foreignKey: { name: "categoryId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
