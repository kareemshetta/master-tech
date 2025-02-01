import Store from "./stores.model";

// Self-referential relationships
Store.hasMany(Store, { foreignKey: "parentId", as: "subStores" });
Store.belongsTo(Store, { foreignKey: "parentId", as: "parentStore" });
