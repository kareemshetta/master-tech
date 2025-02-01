import i18n from "i18next";
import Backend from "i18next-fs-backend";
import { LanguageDetector } from "i18next-http-middleware";

i18n
  .use(Backend)
  .use(LanguageDetector)
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

export default i18n;
