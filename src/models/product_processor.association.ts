import Product from "./products.model";
import Processor from "./processor.model";

Processor.hasOne(Product, {
  foreignKey: { name: "processorId", allowNull: true },
  onDelete: "CASCADE",
});
Product.belongsTo(Processor, {
  foreignKey: { name: "processorId", allowNull: true },
  onUpdate: "CASCADE",
});
