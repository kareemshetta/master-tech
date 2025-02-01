import { ProductSku } from "./product_skus.model";
import Product from "./products.model";

Product.hasMany(ProductSku, { foreignKey: "productId", as: "skus" });
ProductSku.belongsTo(Product, { foreignKey: "productId", as: "product" });
