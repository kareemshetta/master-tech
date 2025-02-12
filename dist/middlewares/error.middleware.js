"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = require("../utils/appError");
const errorHandler = (err, //AppError | ValidationError
req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (err) {
        // console.log(typeof err, err instanceof AppError);
        const message = err instanceof appError_1.AppError
            ? req.t(`errors.${err.message}`, { replacer: err.replacer })
            : err.message;
        res.status(err.statusCode).json({
            status: err instanceof appError_1.AppError ? req.t(`errors.${err.status}`) : err.status,
            message: message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    }
};
exports.errorHandler = errorHandler;
