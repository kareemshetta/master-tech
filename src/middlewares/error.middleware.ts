import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../utils/appError";

export const errorHandler = (
  err: any, //AppError | ValidationError
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err) {
    console.log(typeof err, err instanceof AppError);
    const message =
      err instanceof AppError
        ? req.t(`errors.${err.message}`, { replacer: err.replacer })
        : err.message;
    res.status(err.statusCode).json({
      status:
        err instanceof AppError ? req.t(`errors.${err.status}`) : err.status,
      message: message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};
