const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    attachments: {
      type: Array,
      default : []
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("task", taskSchema);