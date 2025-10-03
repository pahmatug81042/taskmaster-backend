const express = require("express");
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const authorizeProject = require("../middleware/authorizeProject");
const authorizeTask = require("../middleware/authorizeTask");

const router = express.Router({ mergeParams: true });

// All task routes require authentication
router.use(protect);

// Routes under /api/projects/:projectId/tasks
router
    .route("/")
    .post(authorizeProject, createTask) // project ownership checked
    .get(authorizeProject, getTasks);

// Routes for single task (must authorize project first, then the task)
router
    .route("/:taskId")
    .get(authorizeProject, authorizeTask, getTaskById)
    .put(authorizeProject, authorizeTask, updateTask)
    .delete(authorizeProject, authorizeTask, deleteTask);

module.exports = router;