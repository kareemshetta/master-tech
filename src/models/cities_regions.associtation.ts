import City from "./cities.model";
import Region from "./regions.model";

City.hasMany(Region, {
  foreignKey: "cityId",

  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Region.belongsTo(City, {
  foreignKey: "cityId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
