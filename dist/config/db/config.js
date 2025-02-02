"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
require("dotenv/config");
// import "../../../ca.pem";
const dbName = process.env.DATABASE_NAME;
const dbUsername = process.env.DATABASE_USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbHost = process.env.DATABASE_HOST;
const dbPort = process.env.DATABASE_PORT;
const dbDialect = process.env.DATABASE_DIALECT;
const sequelize = new sequelize_1.Sequelize(dbName, dbUsername, dbPassword, {
    host: dbHost,
    port: Number(dbPort),
    pool: {
        max: 100,
        min: 0,
        acquire: 90000,
        idle: 10000,
    },
    dialect: dbDialect,
    dialectOptions: {
        // ssl: process.env.DATABASE_URL ? true : false,
        ssl: {
            require: true, // This will require SSL
            rejectUnauthorized: false,
            ca: Buffer.from(process.env.DATABASE_CA, "base64"),
        },
    },
    logging: false,
});
exports.default = sequelize;
