const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const notificationsController = require("../controllers/notifications.controller");

// add a notification
router.post(
  "/add-notification",
  authMiddleware,
  notificationsController.addNotification
);

// get all notifications
router.get(
  "/get-all-notifications",
  authMiddleware,
  notificationsController.getAllNotifications
);

// mark notification as read
router.post(
  "/mark-as-read",
  authMiddleware,
  notificationsController.markNotification
);

// delete all notifications
router.delete(
  "/delete-all-notifications",
  authMiddleware,
  notificationsController.deleteNotifications
);

module.exports = router;
