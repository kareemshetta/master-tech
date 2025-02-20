"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const versions_routes_1 = __importDefault(require("./modules/users/versions.routes"));
const versions_routes_2 = __importDefault(require("./modules/auth/versions.routes"));
const versions_routes_3 = __importDefault(require("./modules/stores/versions.routes"));
const versions_routes_4 = __importDefault(require("./modules/categories/versions.routes"));
const versions_routes_5 = __importDefault(require("./modules/brands/versions.routes"));
const versions_routes_6 = __importDefault(require("./modules/attributes/versions.routes"));
const versions_routes_7 = __importDefault(require("./modules/products/versions.routes"));
const versions_routes_8 = __importDefault(require("./modules/uploads/versions.routes"));
const versions_routes_9 = __importDefault(require("./modules/carts/versions.routes"));
const versions_routes_10 = __importDefault(require("./modules/admins/versions.routes"));
const versions_routes_11 = __importDefault(require("./modules/orders/versions.routes"));
const versions_routes_12 = __importDefault(require("./modules/cities/versions.routes"));
const versions_routes_13 = __importDefault(require("./modules/regions/versions.routes"));
const versions_routes_14 = __importDefault(require("./modules/reviews/versions.routes"));
const versions_routes_15 = __importDefault(require("./modules/contact-us/versions.routes"));
const versions_routes_16 = __importDefault(require("./modules/aboutus/versions.routes"));
const versions_routes_17 = __importDefault(require("./modules/home/versions.routes"));
const versions_routes_18 = __importDefault(require("./modules/processors/versions.routes"));
const path_1 = __importDefault(require("path"));
const injectRoutes = (app) => {
    // Basic route
    app.get("/", (req, res) => {
        res.json({ message: "Hello from MasterTech!" });
    });
    app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
    app.use("/users", versions_routes_1.default);
    app.use("/admins", versions_routes_10.default);
    app.use("/auth", versions_routes_2.default);
    app.use("/stores", versions_routes_3.default);
    app.use("/categories", versions_routes_4.default);
    app.use("/brands", versions_routes_5.default);
    app.use("/attributes", versions_routes_6.default);
    app.use("/products", versions_routes_7.default);
    app.use("/upload", versions_routes_8.default);
    app.use("/carts", versions_routes_9.default);
    app.use("/orders", versions_routes_11.default);
    app.use("/cities", versions_routes_12.default);
    app.use("/regions", versions_routes_13.default);
    app.use("/reviews", versions_routes_14.default);
    app.use("/contact-us", versions_routes_15.default);
    app.use("/about-us", versions_routes_16.default);
    app.use("/home", versions_routes_17.default);
    app.use("/processors", versions_routes_18.default);
};
exports.injectRoutes = injectRoutes;
