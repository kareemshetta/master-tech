import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { IAdmin, Iuser } from "../utils/shared.types";
import User from "../models/users.model";

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

export const optionalAuthenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: IAdmin, info: any) => {
      if (err) {
        // Handle any unexpected error
        return next(err);
      }

      // Attach the user to the request if authenticated
      if (user) {
        // console.log(user);
        req.user = user;
      }

      // Proceed to the next middleware regardless of authentication
      next();
    }
  )(req, res, next);
};
