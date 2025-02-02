"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendEmail(userEmails, subject, content, attachments, ccEmails) {
    const mail = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.ADMIN_MAIL,
            pass: process.env.ADMIN_PASSWORD,
        },
        // logger: true, // Enable logging
        // debug: true, // Enable debugging
    });
    let mailOptions = {
        from: process.env.ADMIN_MAIL,
        to: userEmails,
        cc: ccEmails,
        subject: subject,
        html: `<p>${content}</p>`,
        attachments,
    };
    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            info;
        }
    });
}
