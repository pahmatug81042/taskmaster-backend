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
const validateObjectId = require("../utils/validateObjectId");

const router = express.Router();

// All project routes require authentication
router.use(protect);

// Create new project
router.post("/", createProject);

// Get all projects for logged-in user
router.get("/", getProjects);

// Get, update, delete project by ID
router
    .route("/:projectId")
    .get(validateObjectId("projectId"), authorizeProject, getProjectById)
    .put(validateObjectId("projectId"), authorizeProject, updateProject)
    .delete(validateObjectId("projectId"), authorizeProject, deleteProject);

module.exports = router;