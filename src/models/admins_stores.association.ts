import Admin from "./admins.model";
import Store from "./stores.model";
Store.hasMany(Admin, { foreignKey: "storeId" });
Admin.belongsTo(Store, { foreignKey: "storeId" });
