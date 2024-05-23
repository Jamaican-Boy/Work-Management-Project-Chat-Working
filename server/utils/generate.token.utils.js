const bcrypt = require("bcryptjs");
const EmailToken = require("../models/verify.email.model");
const PasswordToken = require("../models/verify.password.model");

async function generateToken(tokenType, user) {
  let token;
  if (tokenType === "email") {
    const encryptedToken = bcrypt
      .hashSync(user._id.toString(), 10)
      .replaceAll("/", "");

    token = new EmailToken({
      userid: user._id,
      token: encryptedToken,
    });
  } else {
    const encryptedToken = bcrypt
      .hashSync(user._id.toString(), 10)
      .replaceAll("/", "");

    token = new PasswordToken({
      userid: user._id,
      token: encryptedToken,
    });
  }
  
  await token.save();
  return token.token; 
}

module.exports = generateToken;
