import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/db/config";
import { UserStatus } from "../utils/enums";
const SALT = process.env.SALT as string;
class User extends Model {
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(Number(SALT));
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    image: {
      type: DataTypes.STRING,
      // allowNull: false,
      defaultValue: "/uploads/avatar.jpg",
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },

    phoneNumber: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },

    // gender: {
    //   type: DataTypes.STRING(128),
    // },
    birthDate: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(UserStatus)),
      allowNull: false,
      defaultValue: UserStatus.Active,
      validate: {
        isIn: [Object.values(UserStatus)],
      },
    },
    role: {
      type: DataTypes.STRING(128),
      allowNull: true,
      defaultValue: "user",
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    otp: { type: DataTypes.STRING(8), allowNull: true },
    otpCreatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "users",
    timestamps: true,
    paranoid: true,
  }
);

User.beforeCreate(async (user: any, options) => {
  if (user.password) {
    const hashedPassword = await user.hashPassword(user.password);
    user.password = hashedPassword;
  }
});

User.beforeUpdate(async (user: any, options) => {
  if (user.changed("password")) {
    const hashedPassword = await user.hashPassword(user.password);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
  }
});
export default User;
