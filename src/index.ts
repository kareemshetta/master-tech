import express, { Express } from "express";
import cors from "cors";
import i18next from "./config/i18n";
import middleware from "i18next-http-middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { initialize } from "./config/db/tables";
import "./config/passport/passport.config";
import morgan from "morgan";
import passport from "passport";
import { injectRoutes } from "./routes";

const app: Express = express();

// Middleware to parse JSON bodies
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(middleware.handle(i18next));

injectRoutes(app);
// Handle 404
app.use(notFoundHandler);

// Handle errors
app.use(errorHandler);

// Start server
initialize(app);

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
