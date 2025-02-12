"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const i18n_1 = __importDefault(require("./config/i18n"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const notFound_middleware_1 = require("./middlewares/notFound.middleware");
const error_middleware_1 = require("./middlewares/error.middleware");
const tables_1 = require("./config/db/tables");
require("./config/passport/passport.config");
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
// Middleware to parse JSON bodies
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use(i18next_http_middleware_1.default.handle(i18n_1.default));
(0, routes_1.injectRoutes)(app);
// Handle 404
app.use(notFound_middleware_1.notFoundHandler);
// Handle errors
app.use(error_middleware_1.errorHandler);
// Start server
(0, tables_1.initialize)(app);
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
