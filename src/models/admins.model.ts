import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../config/db/config";
import { UserStatus } from "../utils/enums";
const SALT = process.env.SALT as string;
class Admin extends Model {
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(Number(SALT));
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
}
Admin.init(
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

    gender: {
      type: DataTypes.STRING(128),
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
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

    deletedAt: {
      type: DataTypes.DATE,
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
    },
    role: {
      type: DataTypes.STRING(128),

      allowNull: true,
      defaultValue: "admin",
    },
  },
  {
    sequelize,
    modelName: "admins",
    timestamps: true,
    paranoid: true,
  }
);

Admin.beforeCreate(async (user: any, options) => {
  if (user.password) {
    const hashedPassword = await user.hashPassword(user.password);
    user.password = hashedPassword;
  }

  if (user.email) {
    user.email = user.email.toLowerCase();
  }
});

Admin.beforeUpdate(async (user: any, options) => {
  if (user.changed("password")) {
    const hashedPassword = await user.hashPassword(user.password);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
  }

  if (user.changed("email")) {
    user.email = user.email.toLowerCase();
  }
});
export default Admin;
