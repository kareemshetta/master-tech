"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectRoutes = void 0;
const versions_routes_1 = __importDefault(require("./modules/users/versions.routes"));
const versions_routes_2 = __importDefault(require("./modules/auth/versions.routes"));
const versions_routes_3 = __importDefault(require("./modules/stores/versions.routes"));
const versions_routes_4 = __importDefault(require("./modules/categories/versions.routes"));
const versions_routes_5 = __importDefault(require("./modules/brands/versions.routes"));
const versions_routes_6 = __importDefault(require("./modules/attributes/versions.routes"));
const versions_routes_7 = __importDefault(require("./modules/products/versions.routes"));
const versions_routes_8 = __importDefault(require("./modules/uploads/versions.routes"));
const versions_routes_9 = __importDefault(require("./modules/carts/versions.routes"));
const injectRoutes = (app) => {
    // Basic route
    app.get("/", (req, res) => {
        res.json({ message: "Hello from MasterTech!" });
    });
    app.use("/users", versions_routes_1.default);
    app.use("/auth", versions_routes_2.default);
    app.use("/stores", versions_routes_3.default);
    app.use("/categories", versions_routes_4.default);
    app.use("/brands", versions_routes_5.default);
    app.use("/attributes", versions_routes_6.default);
    app.use("/products", versions_routes_7.default);
    app.use("/upload", versions_routes_8.default);
    app.use("/carts", versions_routes_9.default);
};
exports.injectRoutes = injectRoutes;
