import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = req.t("errors.notFound", {
    url: req.originalUrl.replace(/\//g, "|"),
  });
  res.status(404).json({ message });
};
