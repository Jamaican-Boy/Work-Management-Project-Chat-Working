const router = require("express").Router();

const authMiddleware = require("../middlewares/auth.middleware");
const usersController = require("../controllers/users.controller");

const User = require("../models/user.model")

// register a new user
router.post("/register", usersController.registerUser);

// login a user
router.post("/login", usersController.loginUser);

// get logged in user
router.get(
  "/get-logged-in-user",
  authMiddleware,
  usersController.getLoggedInUser
);

router.post("/send-password-reset-link", usersController.sendPasswordResetLink);

router.post("/reset-password", usersController.resetPassword);

router.post("/verifyemail", usersController.verifyEmail);


// get all users except current user

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.body.userId } });
    res.send({
      success: true,
      message: "Users fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

// update user profile picture

router.post("/update-profile-picture", authMiddleware, async (req, res) => {
  try {
    const image = req.body.image;

    // upload image to cloudinary and get url

    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "ksr",
    });

    // update user profile picture

    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { profilePic: uploadedImage.secure_url },
      { new: true }
    );

    res.send({
      success: true,
      message: "Profile picture updated successfully",
      data: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});


module.exports = router;
