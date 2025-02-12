"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessableEntityError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode, replacer) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.replacer = replacer;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.status = " validation error";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ValidationError = ValidationError;
class UnprocessableEntityError extends Error {
    constructor(message = "Un processable Entity Error") {
        super(message);
        this.statusCode = 422;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
