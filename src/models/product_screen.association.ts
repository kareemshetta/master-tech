import Product from "./products.model";
import Screen from "./screen.model";
// Self-referential relationships
Screen.hasOne(Product, {
  foreignKey: { name: "screenId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.belongsTo(Screen, {
  foreignKey: { name: "screenId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
