"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = require("i18next-http-middleware");
i18next_1.default
    .use(i18next_fs_backend_1.default)
    .use(i18next_http_middleware_1.LanguageDetector)
    .init({
    fallbackLng: "en",
    preload: ["en", "ar"], // Preload your supported languages
    backend: {
        loadPath: "./src/locales/{{lng}}/translation.json", // Translation files path
    },
    detection: {
        order: ["querystring", "header"],
        lookupQuerystring: "lng", // Detect language via query string or HTTP headers
        caches: false,
    },
});
exports.default = i18next_1.default;
