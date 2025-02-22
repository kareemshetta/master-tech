import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../../models/users.model";
import Admin from "../../models/admins.model";
import { IAdmin, Iuser } from "../../utils/shared.types";
import { AppError } from "../../utils/appError";
import { UserStatus } from "../../utils/enums";
import { log } from "console";
import Cart from "../../models/carts.model";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT || "your-secret-key",
};

// Strategy for mobile users
passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user: Iuser | undefined = (
        await User.findByPk(payload.id, {
          include: [{ model: Cart, attributes: ["id"] }],
        })
      )?.toJSON();

      if (!user) {
        const appError = new AppError("unAuthorized", 401);
        return done(appError, false);
      }

      // Check if user is active/enabled

      if (user.status == UserStatus.Suspended) {
        const error = new AppError("unAuthorized", 401);

        return done(error, false);
      }

      return done(null, user);
    } catch (error) {
      const err = new AppError("unAuthorized", 401);
      log(err);
      //   authError.status = 500;
      //   authError.code = "AUTH_FAILED";
      return done(err, false);
    }
  })
);

// Strategy for admin users
passport.use(
  "jwt-admin",
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const admin = (await Admin.findByPk(payload.id))?.toJSON() as IAdmin;
      if (!admin) {
        const appError = new AppError("unAuthorized", 401);
        return done(appError, false);
      }

      // Check if admin is active/enabled

      if (admin.status == UserStatus.Suspended) {
        const error = new AppError("unAuthorized", 401);

        return done(error, false);
      }

      return done(null, admin);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
