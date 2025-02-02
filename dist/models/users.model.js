"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../config/db/config"));
const enums_1 = require("../utils/enums");
const SALT = process.env.SALT;
class User extends sequelize_1.Model {
    async hashPassword(password) {
        const salt = await bcrypt_1.default.genSalt(Number(SALT));
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        return hashedPassword;
    }
}
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        // allowNull: false,
        defaultValue: "/uploads/avatar.jpg",
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: true,
        },
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    // gender: {
    //   type: DataTypes.STRING(128),
    // },
    birthDate: {
        type: sequelize_1.DataTypes.DATEONLY,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(enums_1.UserStatus)),
        allowNull: false,
        defaultValue: enums_1.UserStatus.Active,
        validate: {
            isIn: [Object.values(enums_1.UserStatus)],
        },
    },
    role: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
        defaultValue: "user",
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    otp: { type: sequelize_1.DataTypes.STRING(8), allowNull: true },
    otpCreatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    passwordChangedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: config_1.default,
    modelName: "users",
    timestamps: true,
    paranoid: true,
});
User.beforeCreate(async (user, options) => {
    if (user.password) {
        const hashedPassword = await user.hashPassword(user.password);
        user.password = hashedPassword;
    }
});
User.beforeUpdate(async (user, options) => {
    if (user.changed("password")) {
        const hashedPassword = await user.hashPassword(user.password);
        user.password = hashedPassword;
        user.passwordChangedAt = new Date();
    }
});
exports.default = User;
