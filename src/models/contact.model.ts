import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db/config";
import { ContactType } from "../utils/enums";

class Contact extends Model {}

Contact.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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

    contactType: {
      type: DataTypes.ENUM(...Object.values(ContactType)),
      allowNull: false,
      defaultValue: ContactType.Partner,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    sequelize,
    modelName: "contactus",
    paranoid: true,
    timestamps: true,

    indexes: [
      { fields: ["message"], name: "message_contact_idx" },
      { fields: ["email"], name: "email_contact_idx" },
      { fields: ["firstName"], name: "fname_contact_idx" },
      { fields: ["lastName"], name: "lname_contact_idx" },
    ],
  }
);

export default Contact;
