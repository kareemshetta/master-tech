import sequelize from "./config";
import os from "os";
import { Application } from "express"; // Import the Application type from Express
// Update the path to your Sequelize configuration file
import("./../../models/users.model");
import("./../../models/admins.model");
import("./../../models/stores.model");
import("./../../models/categories.model");
import("./../../models/brands.model");
import("./../../models/screen.model");
import("./../../models/processor.model");
import("./../../models/product_attributes.model");
import("./../../models/product_skus.model");
import("./../../models/carts.model");
import("./../../models/cartItem.model");
import("./../../models/orders.model");
import("./../../models/orderItem.model");
import("./../../models/cities.model");
import("./../../models/regions.model");
import("./../../models/user_products_favourite.model");
import("./../../models/review.model");

// store_sub_stores association
import("./../../models/store_sub_stores.association");

// store_Admins association
import("./../../models/admins_stores.association");
// product_screen association
import("./../../models/product_screen.association");
// product_processor association
import("./../../models/product_processor.association");
// product_category association
import("./../../models/product_category.association");
// product_brand association
import("./../../models/product_brand.association");
// attributes_sku_association
import("./../../models/product_attributes_product_sku.associations");
// product_sku_association
import("./../../models/product_product_sku.association");
// store_product_association
import("./../../models/store_product.association");
// user_cart_association
import("./../../models/users_cart.association");
// cart_item_association
import("./../../models/cart_cartitem.associations");
// cart_item_sku_association
import("./../../models/cartItem_sku.associations");
// order_item_association
import("./../../models/orders_ordersItem.associations");
// city_region_association
import("./../../models/cities_regions.associtation");
// store_region_association
import("./../../models/stores_region_city.associations");
// user_products_favourite_association
import("./../../models/products_user_favourite.association");
// prduct_user_review_association
import("./../../models/reviews_product_user_association");
export const initialize = async (app: Application): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Connection to  database has been established successfully.");

    // await sequelize.sync({
    //   alter: true,
    //   // logging: console.log
    // });
    // console.log("All models were synchronized successfully.");

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
    app.listen(port, () =>
      console.log(`⚡️Server is running at ${os.hostname()}:${port}`)
    );
  } catch (e) {
    console.error("Error during initialization:", e);

    process.exit(1);
  }
};
