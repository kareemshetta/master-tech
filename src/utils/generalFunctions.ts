import { ValidationError } from "./appError";
import { validate as uuidValidate } from "uuid";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import crypto from "crypto";
const SALT = process.env.SALT as string;
export function validateArrayOfUUID(
  uuidArray: string[],
  message: string = "Invalid array of uuid"
) {
  for (let uuid of uuidArray) {
    validateUUID(uuid, message);
  }
}
export function validateUUID(id?: string, errorMessage?: string) {
  if (!isUUID(id)) {
    throw new ValidationError(errorMessage || "invalid uuid");
  }
}
export const isUUID = (value: any): boolean => {
  return typeof value === "string" && uuidValidate(value);
};

export const generateToken = (user: any, expiresIn: string = "24h") => {
  return jwt.sign(user, process.env.JWT || "secret", { expiresIn });
};
export const comparePassword = (loginPassword: string, realPassword: any) => {
  return bcrypt.compare(loginPassword, realPassword);
};

export const checkArraysWithSet = (array1: string[], array2: string[]) => {
  return array1.every((element) => array2.includes(element));
};

export const getNotIncludedIds = (array1: string[], array2: string[]) => {
  return array1.filter((element) => !array2.includes(element));
};

export const generateSecureOTP = (length: number = 5): string => {
  return crypto
    .randomBytes(length)
    .map((x) => x % 10)
    .join("");
};

export const generateOrderId = (length: number = 8): string => {
  const prefix = "#ORD";
  const randomHex = crypto.randomBytes(length).toString("hex").toUpperCase();
  return `${prefix}-${randomHex}`;
};

export function isNowGreaterThanBy15Minutes(targetDate: Date): boolean {
  const now = new Date(); // Current date and time
  const fifteenMinutesLater = new Date(targetDate.getTime() + 15 * 60 * 1000); // Add 15 minutes to the target date

  return now > fifteenMinutesLater;
}

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(Number(SALT));
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export { hashPassword };
