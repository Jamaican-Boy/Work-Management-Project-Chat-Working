const Notification = require("../models/notification.model");

// add a notification
exports.addNotification = async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();
    res.send({
      success: true,
      data: newNotification,
      message: "Notification added successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
};

// get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.body.userId,
    }).sort({ createdAt: -1 });
    res.send({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
};

// mark notification as read
exports.markNotification = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.body.userId,
        read: false,
      },
      {
        read: true,
      }
    );
    const notifications = await Notification.find({
      user: req.body.userId,
    }).sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Notifications marked as read",
      data: notifications,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
};

// delete all notifications
exports.deleteNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.body.userId,
    });
    res.send({
      success: true,
      message: "All notifications deleted",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
};
