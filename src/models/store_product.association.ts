import Product from "./products.model";
import Store from "./stores.model";

Store.hasMany(Product, { foreignKey: "storeId", as: "products" });
Product.belongsTo(Store, { foreignKey: "storeId", as: "store" });
