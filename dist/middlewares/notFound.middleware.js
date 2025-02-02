"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const notFoundHandler = (req, res, next) => {
    const message = req.t("errors.notFound", {
        url: req.originalUrl.replace(/\//g, "|"),
    });
    res.status(404).json({ message });
};
exports.notFoundHandler = notFoundHandler;
