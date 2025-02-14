"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/db/config"));
const enums_1 = require("../utils/enums");
class Contact extends sequelize_1.Model {
}
Contact.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
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
    contactType: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(enums_1.ContactType)),
        allowNull: false,
        defaultValue: enums_1.ContactType.Partner,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
}, {
    sequelize: config_1.default,
    modelName: "contactus",
    paranoid: true,
    timestamps: true,
    indexes: [
        { fields: ["message"], name: "message_contact_idx" },
        { fields: ["email"], name: "email_contact_idx" },
        { fields: ["firstName"], name: "fname_contact_idx" },
        { fields: ["lastName"], name: "lname_contact_idx" },
    ],
});
exports.default = Contact;
