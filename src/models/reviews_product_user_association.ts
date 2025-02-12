import User from "./users.model";
import Product from "./products.model";
import Review from "./review.model";

User.hasMany(Review, {
  foreignKey: { name: "userId" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Review.belongsTo(User, {
  foreignKey: { name: "userId" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.hasMany(Review, {
  foreignKey: { name: "productId" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Review.belongsTo(Product, {
  foreignKey: { name: "productId" },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
