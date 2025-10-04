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
const validateObjectId = require("../utils/validateObjectId");

const router = express.Router({ mergeParams: true });

// All task routes require authentication
router.use(protect);

// Routes under /api/projects/:projectId/tasks
router
    .route("/")
    .post(validateObjectId("projectId"), authorizeProject, createTask)
    .get(validateObjectId("projectId"), authorizeProject, getTasks);

// Routes for single task
router
    .route("/:taskId")
    .get(
        validateObjectId("projectId"),
        validateObjectId("taskId"),
        authorizeProject,
        authorizeTask,
        getTaskById
    )
    .put(
        validateObjectId("projectId"),
        validateObjectId("taskId"),
        authorizeProject,
        authorizeTask,
        updateTask
    )
    .delete(
        validateObjectId("projectId"),
        validateObjectId("taskId"),
        authorizeProject,
        authorizeTask,
        deleteTask
    );

module.exports = router;