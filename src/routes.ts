import express from "express";
import { Application, Request, Response } from "express";
import userRoute from "./modules/users/versions.routes";
import authRoute from "./modules/auth/versions.routes";
import storeRoute from "./modules/stores/versions.routes";
import catRoute from "./modules/categories/versions.routes";
import brandRoute from "./modules/brands/versions.routes";
import attributesRoute from "./modules/attributes/versions.routes";
import productsRoute from "./modules/products/versions.routes";
import uploadsRoute from "./modules/uploads/versions.routes";
import cartsRoute from "./modules/carts/versions.routes";
import adminsRoute from "./modules/admins/versions.routes";
import ordersRoute from "./modules/orders/versions.routes";
import citiesRoute from "./modules/cities/versions.routes";
import regionsRoute from "./modules/regions/versions.routes";

import path from "path";
export const injectRoutes = (app: Application): void => {
  // Basic route
  app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello from MasterTech!" });
  });

  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
  app.use("/users", userRoute);
  app.use("/admins", adminsRoute);
  app.use("/auth", authRoute);
  app.use("/stores", storeRoute);
  app.use("/categories", catRoute);
  app.use("/brands", brandRoute);
  app.use("/attributes", attributesRoute);
  app.use("/products", productsRoute);
  app.use("/upload", uploadsRoute);
  app.use("/carts", cartsRoute);
  app.use("/orders", ordersRoute);
  app.use("/cities", citiesRoute);
  app.use("/regions", regionsRoute);
};
