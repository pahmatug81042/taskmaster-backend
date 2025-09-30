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
const { post } = require("./projectRoutes");

const router = express.Router({ mergeParams: true });

// All task routes require authentication
router.use(protect);

// Nested routes under /api/projects/:projectId/tasks
router
    .route("/")
    .post(authorizeProject, createTask)
    .get(authorizeProject, getTasks);

router
    .route("/:taskId")
    .get(authorizeProject, getTaskById)
    .put(authorizeProject, updateTask)
    .delete(authorizeProject, deleteTask);

module.exports = router;