const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
  {
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  },
  {
    from: "Two2Buddy <two-2-buddy@mail.ru>",
  }
);

const mailer = (message) => {
  transporter.sendMail(message, (err, info) => {
    if (err) return console.log(err);
    console.log("Email sent successfully: ", info);
  });
};

module.exports = mailer;
