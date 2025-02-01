import nodemailer from "nodemailer";

export function sendEmail(
  userEmails: string[],
  subject: string,
  content: string,
  attachments?: any[],
  ccEmails?: string[]
) {
  const mail = nodemailer.createTransport({
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
    } else {
      info;
    }
  });
}
