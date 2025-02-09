"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const config_1 = __importDefault(require("./config"));
const os_1 = __importDefault(require("os"));
// Update the path to your Sequelize configuration file
Promise.resolve().then(() => __importStar(require("./../../models/users.model")));
Promise.resolve().then(() => __importStar(require("./../../models/admins.model")));
Promise.resolve().then(() => __importStar(require("./../../models/stores.model")));
Promise.resolve().then(() => __importStar(require("./../../models/categories.model")));
Promise.resolve().then(() => __importStar(require("./../../models/brands.model")));
Promise.resolve().then(() => __importStar(require("./../../models/screen.model")));
Promise.resolve().then(() => __importStar(require("./../../models/processor.model")));
Promise.resolve().then(() => __importStar(require("./../../models/product_attributes.model")));
Promise.resolve().then(() => __importStar(require("./../../models/product_skus.model")));
Promise.resolve().then(() => __importStar(require("./../../models/carts.model")));
Promise.resolve().then(() => __importStar(require("./../../models/cartItem.model")));
Promise.resolve().then(() => __importStar(require("./../../models/orders.model")));
Promise.resolve().then(() => __importStar(require("./../../models/orderItem.model")));
Promise.resolve().then(() => __importStar(require("./../../models/cities.model")));
Promise.resolve().then(() => __importStar(require("./../../models/regions.model")));
Promise.resolve().then(() => __importStar(require("./../../models/user_products_favourite.model")));
// store_sub_stores association
Promise.resolve().then(() => __importStar(require("./../../models/store_sub_stores.association")));
// store_Admins association
Promise.resolve().then(() => __importStar(require("./../../models/admins_stores.association")));
// product_screen association
Promise.resolve().then(() => __importStar(require("./../../models/product_screen.association")));
// product_processor association
Promise.resolve().then(() => __importStar(require("./../../models/product_processor.association")));
// product_category association
Promise.resolve().then(() => __importStar(require("./../../models/product_category.association")));
// product_brand association
Promise.resolve().then(() => __importStar(require("./../../models/product_brand.association")));
// attributes_sku_association
Promise.resolve().then(() => __importStar(require("./../../models/product_attributes_product_sku.associations")));
// product_sku_association
Promise.resolve().then(() => __importStar(require("./../../models/product_product_sku.association")));
// store_product_association
Promise.resolve().then(() => __importStar(require("./../../models/store_product.association")));
// user_cart_association
Promise.resolve().then(() => __importStar(require("./../../models/users_cart.association")));
// cart_item_association
Promise.resolve().then(() => __importStar(require("./../../models/cart_cartitem.associations")));
// cart_item_sku_association
Promise.resolve().then(() => __importStar(require("./../../models/cartItem_sku.associations")));
// order_item_association
Promise.resolve().then(() => __importStar(require("./../../models/orders_ordersItem.associations")));
// city_region_association
Promise.resolve().then(() => __importStar(require("./../../models/cities_regions.associtation")));
// store_region_association
Promise.resolve().then(() => __importStar(require("./../../models/stores_region_city.associations")));
// user_products_favourite_association
Promise.resolve().then(() => __importStar(require("./../../models/products_user_favourite.association")));
const initialize = async (app) => {
    try {
        await config_1.default.authenticate();
        console.log("Connection to  database has been established successfully.");
        // await sequelize.sync({
        //   alter: true,
        //   // logging: console.log
        // });
        // console.log("All models were synchronized successfully.");
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
        app.listen(port, () => console.log(`⚡️Server is running at ${os_1.default.hostname()}:${port}`));
    }
    catch (e) {
        console.error("Error during initialization:", e);
        process.exit(1);
    }
};
exports.initialize = initialize;
