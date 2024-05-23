const Project = require("../models/project.model");
const User = require("../models/user.model");

// create a project
exports.createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.send({
      success: true,
      data: newProject,
      message: "Project created successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
};

// get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.body.userId,
    }).sort({ createdAt: -1 });
    res.send({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
};

// get project by id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.body._id)
      .populate("owner")
      .populate("members.user");
    res.send({
      success: true,
      data: project,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
};

// get projects by role
exports.getProjectByRole = async (req, res) => {
  try {
    const userId = req.body.userId;
    const projects = await Project.find({ "members.user": userId })
      .sort({
        createdAt: -1,
      })
      .populate("owner");
    res.send({
      success: true,
      data: projects,
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
};

// edit a project
exports.editProject = async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      success: true,
      message: "Project updated successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
};

// delete a project
exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
};

// add a member to a project
exports.addMemberToProject = async (req, res) => {
  try {
    const { email, role, projectId } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.send({
        success: false,
        message: "User email is not verified",
      });
    }

    await Project.findByIdAndUpdate(projectId, {
      $push: {
        members: {
          user: user._id,
          role,
        },
      },
    });

    res.send({
      success: true,
      message: "Member added successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
};

// remove a member from a project
exports.removeMemberFromProject = async (req, res) => {
  try {
    const { memberId, projectId } = req.body;

    const project = await Project.findById(projectId);
    project.members.pull(memberId);
    await project.save();

    res.send({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    res.send({
      error: error.message,
      success: false,
    });
  }
};
