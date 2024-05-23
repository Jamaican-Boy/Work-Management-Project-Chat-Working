const bcrypt = require("bcryptjs");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const EmailToken = require("../models/verify.email.model");
const PasswordToken = require("../models/verify.password.model");
const User = require("../models/user.model");
const sendEmail = require("../helpers/send.email.helper");
const passwordRegex = require("../helpers/password.policy.helper");

// register a new user
exports.registerUser = async (req, res) => {
  try {
    // Check if the user already exists
    const email = req.body.email;
    let user = await User.findOne({ email: email });

    // If user exists but is not verified, update user details and send a verification token
    if (user) {
      if (!user.isVerified) {
        // Update user details if provided in the request
        if (req.body.firstName) user.firstName = req.body.firstName;
        if (req.body.lastName) user.lastName = req.body.lastName;
        if (req.body.password) {
          // Check password requirements
          const password = req.body.password;
          if (!passwordRegex.test(password)) {
            throw new Error(
              "Password reset link sent to your email successfully"
            );
          }
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          user.password = hashedPassword;
        }
        // Save the updated user
        user = await user.save();

        // Check if there's an existing token for the user
        let existingToken = await EmailToken.findOne({ userid: user._id });
        if (existingToken) {
          // Delete the existing token
          await EmailToken.findOneAndDelete({ userid: user._id });
        }

        // Assuming token is passed in the request body
        const newToken = req.body.token;

        // Send email for verification
        await sendEmail(user, "verifyemail", newToken);

        return res.send({
          success: true,
          message:
            "User already exists but is not verified. Updated details and verification email sent.",
        });
      } else {
        throw new Error("User already exists");
      }
    }

    // Hash the password
    const password = req.body.password;
    if (!passwordRegex.test(password)) {
      throw new Error("Your Password Is Weak, Please See The ? for guidance");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    // Save the user
    user = new User(req.body);
    const result = await user.save();

    // Assuming token is passed in the request body
    const token = req.body.token;

    // Send mail after successful registration
    await sendEmail(result, "verifyemail", token);

    res.send({
      success: true,
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// login a user
exports.loginUser = async (req, res) => {
  try {
    // Check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("User does not exist");
    }

    // Check if the password is correct
    const passwordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordCorrect) {
      throw new Error("Invalid password");
    }

    // Check if the user is verified
    if (!user.isVerified) {
      throw new Error("User is not verified");
    }

    // Prepare data to be sent to the frontend
    const dataToBeSentToFrontend = {
      userId: user._id,
      email: user.email,
      name: user.firstName + " " + user.lastName,
    };

    // Create and assign a token
    const token = jwt.sign(dataToBeSentToFrontend, process.env.jwt_secret, {
      expiresIn: "1d",
    });

    res.send({
      success: true,
      data: token,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// get logged in user
exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });

    // remove the password from the user object
    user.password = undefined;

    res.send({
      success: true,
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.sendPasswordResetLink = async (req, res) => {
  try {
    // Find the user by email
    const result = await User.findOne({ email: req.body.email });

    if (result) {
      if (result.isVerified) {
        try {
          // If user found and verified, delete existing token if it exists
          await PasswordToken.findOneAndDelete({
            userid: result._id,
          });

          // Send the password reset link
          await sendEmail(result, "resetpassword");

          return res.send({
            success: true,
            message: "Password reset link sent to your email successfully",
          });
        } catch (deleteError) {
          console.error("Error deleting token:", deleteError);
          return res
            .status(500)
            .send({ success: false, message: "Error deleting token" });
        }
      } else {
        // User found but not verified
        return res.send({
          success: false,
          message:
            "Your account is not verified. Please verify your email address first.",
        });
      }
    } else {
      // No user found with the email id
      return res.send({
        success: false,
        message: "No user found with the provided email",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    let { token, password } = req.body;
    const tokenObj = await PasswordToken.findOne({ token });

    if (!tokenObj) {
      return res.send({ message: "Token is invalid", success: false });
    }

    // Password validation
    if (!passwordRegex.test(password)) {
      return res.send({
        message: "Your password does not meet the requirements",
        success: false,
      });
    }

    const user = await User.findOne({ _id: tokenObj.userid.toString() });

    // Check if the new password is the same as the previous password
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.send({
        message: "New password cannot be the same as the previous password",
        success: false,
      });
    }

    // Generate salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(password, salt);

    // Update user's password and delete the token
    user.password = newPasswordHash;
    await user.save();
    await PasswordToken.findOneAndDelete({ token });

    res
      .status(200)
      .send({ message: "Password reset successfully", success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    // Find user by token
    const tokenData = await EmailToken.findOne({ token: req.body.token });

    // Check if token exists
    if (tokenData) {
      // Check if token creation time has exceeded 30 minutes
      const tokenCreationTime = moment(tokenData.createdAt);
      const currentTime = moment();
      const duration = moment.duration(currentTime.diff(tokenCreationTime));
      const minutesElapsed = duration.asMinutes();

      if (minutesElapsed > 30) {
        // Token expired, delete token and associated user
        await EmailToken.findOneAndDelete({ token: req.body.token });
        await User.findOneAndDelete({ _id: tokenData.userid });
        res.send({
          success: false,
          message: "Token expired. Please re-register.",
        });
      } else {
        // Token is valid, check if user is already verified
        const user = await User.findById(tokenData.userid);

        if (user.isVerified) {
          // User is already verified
          res.send({
            success: false,
            message: "Email is already verified.",
          });
        } else {
          // User is not verified, update verification status and delete token
          await User.findOneAndUpdate(
            { _id: tokenData.userid },
            { isVerified: true }
          );
          await EmailToken.findOneAndDelete({ token: req.body.token });
          res.send({ success: true, message: "Email Verified Successfully" });
        }
      }
    } else {
      // Token not found, delete user and inform them to re-register
      res.send({
        success: false,
        message: "Token not found. Please re-register.",
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
