const Task = require("../models/task.model");
const cloudinary = require("../config/cloudinary.config");

// create a task
exports.createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.send({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "all") {
        delete req.body[key];
      }
    });
    delete req.body["userId"];
    const tasks = await Task.find(req.body)
      .populate("assignedTo")
      .populate("assignedBy")
      .populate("project")
      .sort({ createdAt: -1 });
    res.send({
      success: true,
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// delete task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};

// upload image
exports.uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "tasks",
    });
    const imageURL = result.secure_url;

    await Task.findOneAndUpdate(
      { _id: req.body.taskId },
      {
        $push: {
          attachments: imageURL,
        },
      }
    );

    res.send({
      success: true,
      message: "Image uploaded successfully",
      data: imageURL,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
};
