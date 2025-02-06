import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const authorizeSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === "superAdmin") return next();

  throw new AppError("forbiden", 403);
};

export const isSameUser = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  console.log(id, req.user);
  if (req.user && (req.user.id == id || req.user.role === "superAdmin"))
    return next();

  throw new AppError("forbiden", 403);
};
