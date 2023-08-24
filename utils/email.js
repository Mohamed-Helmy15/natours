const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.from = process.env.FROM_EMAIL;
    this.to = user.email;
    this.url = url;
    this.firstName = user.name.split(" ")[0];
  }

  transporter() {
    if (process.env.NODE_ENV === "production") {
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };
    await this.transporter().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "welcome to our website");
  }
  async passwordReset() {
    await this.send("passwordReset", "your token is valid for only 10 minutes");
  }
};

// const sendEmail = async (email, message, subject) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: "mohamed helmy",
//     to: email,
//     subject,
//     text: message,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
