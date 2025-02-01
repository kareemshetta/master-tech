import Cart from "./carts.model";
import User from "./users.model";

User.hasOne(Cart, {
  foreignKey: { name: "userId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Cart.belongsTo(User, {
  foreignKey: { name: "userId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
