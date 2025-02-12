"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PASSWORD_VALIDATION = exports.PHONE_NUMBER_VALIDATION = void 0;
exports.PHONE_NUMBER_VALIDATION = /^\+\d{1,4} \d{9,12}$/;
exports.PASSWORD_VALIDATION = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-_+=()])/;
