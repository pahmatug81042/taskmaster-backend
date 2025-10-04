const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const { isMongoId } = require("validator");

/**
 * Middleware to check if the authenticated user owns the task.
 * Requires req.project (via authorizeProject).
 * Validates taskId format and attaches the task doc if authorized.
 */
const authorizeTask = asyncHandler(async (req, res, next) => {
    const { taskId } = req.params;

    if (!req.project) {
        res.status(400);
        throw new Error("Project context missing for task authorization");
    }

    // Validate taskId format
    if (!taskId || !isMongoId(taskId)) {
        res.status(400);
        throw new Error("Invalid taskId format");
    }

    // Find the task by ID and ensure it belongs to the project
    const task = await Task.findOne({ _id: taskId, project: req.project._id });

    if (!task) {
        res.status(404);
        throw new Error("Task not found or not authorized");
    }

    // Attach task to request
    req.task = task;

    next();
});

module.exports = authorizeTask;