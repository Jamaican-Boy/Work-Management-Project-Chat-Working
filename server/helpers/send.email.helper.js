const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

const generateToken = require("../utils/generate.token.utils");

require("dotenv").config();

// Function to get base URL based on environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production") {
    return process.env.BASE_URL_PROD;
  } else {
    return process.env.BASE_URL_DEV;
  }
};

module.exports = async (user, mailType) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.email_host,
      auth: {
        user: process.env.email_auth_user,
        pass: process.env.email_auth_password,
      },
    });

    let emailContent, mailOptions;
    if (mailType == "verifyemail") {
      emailContent = await ejs.renderFile(
        path.join(__dirname, "../views/verify.email.view.ejs"),
        {
          url: getBaseUrl(),
          token: await generateToken("email", user),
        }
      );

      mailOptions = {
        from: `"Deependra 👻" <${process.env.email_auth_user}>`,
        to: user.email,
        subject: "Work-Tracker Verify Email",
        html: emailContent,
      };
    } else {
      emailContent = await ejs.renderFile(
        path.join(__dirname, "../views/verify.password.view.ejs"),
        {
          url: getBaseUrl(),
          token: await generateToken("password", user),
        }
      );
      mailOptions = {
        from: `"Deependra 👻" <${process.env.email_auth_user}>`,
        to: user.email,
        subject: "Work-Tracker Reset password",
        html: emailContent,
      };
    }

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
