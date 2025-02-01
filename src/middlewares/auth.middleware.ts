import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", { session: false })(req, res, next);
};

export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt-admin", { session: false })(req, res, next);
};
