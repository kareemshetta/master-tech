import Store from "./stores.model";
import City from "./cities.model";
import Region from "./regions.model";

City.hasMany(Store, {
  foreignKey: { name: "cityId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Region.hasMany(Store, {
  foreignKey: { name: "regionId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Store.belongsTo(City, {
  foreignKey: { name: "cityId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Store.belongsTo(Region, {
  foreignKey: { name: "regionId", allowNull: true },
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
