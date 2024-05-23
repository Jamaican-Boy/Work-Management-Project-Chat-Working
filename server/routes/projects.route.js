const router = require("express").Router();

const authMiddleware = require("../middlewares/auth.middleware");
const projectsController = require("../controllers/projects.controller");

// create a project
router.post(
  "/create-project",
  authMiddleware,
  projectsController.createProject
);

// get all projects
router.post(
  "/get-all-projects",
  authMiddleware,
  projectsController.getAllProjects
);

// get project by id
router.post(
  "/get-project-by-id",
  authMiddleware,
  projectsController.getProjectById
);

// get projects by role
router.post(
  "/get-projects-by-role",
  authMiddleware,
  projectsController.getProjectByRole
);

// edit a project
router.post("/edit-project", authMiddleware, projectsController.editProject);

// delete a project
router.post(
  "/delete-project",
  authMiddleware,
  projectsController.deleteProject
);

// add a member to a project
router.post(
  "/add-member",
  authMiddleware,
  projectsController.addMemberToProject
);

// remove a member from a project
router.post(
  "/remove-member",
  authMiddleware,
  projectsController.removeMemberFromProject
);

module.exports = router;
