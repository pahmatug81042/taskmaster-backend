const express = require("express");
const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const authorizeProject = require("../middleware/authorizeProject");

const router = express.Router();

// All project routes require authentication
router.use(protect);

// Create new project
router.post("/", createProject);

// Get all projects for logged-in user
router.get("/", getProjects);

// Get, update, delete project by ID (ownership enforced by middleware)
router
    .route("/:projectId")
    .get(authorizeProject, getProjectById)
    .put(authorizeProject, updateProject)
    .delete(authorizeProject, deleteProject);

module.exports = router;