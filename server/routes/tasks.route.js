const router = require("express").Router();
const multer = require("multer");

const storage = require("../helpers/multer.helper");
const authMiddleware = require("../middlewares/auth.middleware");
const tasksController = require("../controllers/tasks.controller");

// create a task
router.post("/create-task", authMiddleware, tasksController.createTask);

// get all tasks
router.post("/get-all-tasks", authMiddleware, tasksController.getAllTasks);

// update task
router.post("/update-task", authMiddleware, tasksController.updateTask);

// delete task
router.post("/delete-task", authMiddleware, tasksController.deleteTask);

// upload image
router.post(
  "/upload-image",
  authMiddleware,
  multer({ storage: storage }).single("file"),
  tasksController.uploadImage
);

module.exports = router;
