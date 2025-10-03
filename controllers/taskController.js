const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");

// @desc    Create a new task under a project
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority } = req.body;

    const task = await Task.create({
        title,
        description,
        status,
        priority,
        project: req.project._id, // Project already authorized by middleware
    });

    res.status(201).json(task);
});

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ project: req.project._id });
    res.json(tasks);
});

// @desc    Get single task by ID
// @route   GET /api/projects/:projectId/tasks/:taskId
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
    // req.task is set by authorizeTask middleware
    res.json(req.task);
});

// @desc    Update a task
// @route   PUT /api/projects/:projectId/tasks/:taskId
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority } = req.body;

    // req.task is already authorized
    req.task.title = title || req.task.title;
    req.task.description = description || req.task.description;
    req.task.status = status || req.task.status;
    req.task.priority = priority || req.task.priority;

    const updatedTask = await req.task.save();
    res.json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/projects/:projectId/tasks/:taskId
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    await req.task.deleteOne();
    res.json({ message: "Task removed successfully!" });
});

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
};