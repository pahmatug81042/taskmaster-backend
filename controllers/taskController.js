const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const sanitizeHtml = require("sanitize-html");

// @desc    Create a new task
const createTask = asyncHandler(async (req, res) => {
    let { title, description, status, priority } = req.body;

    if (!title) {
        res.status(400);
        throw new Error("Task title is required");
    }

    title = sanitizeHtml(title.trim());
    description = description ? sanitizeHtml(description.trim()) : "";

    const task = await Task.create({
        title,
        description,
        status,
        priority,
        project: req.project._id,
    });

    res.status(201).json(task);
});

// @desc    Get tasks
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ project: req.project._id });
    res.json(tasks);
});

// @desc    Get task by ID
const getTaskById = asyncHandler(async (req, res) => {
    res.json(req.task);
});

// @desc    Update task
const updateTask = asyncHandler(async (req, res) => {
    let { title, description, status, priority } = req.body;

    if (title) req.task.title = sanitizeHtml(title.trim());
    if (description) req.task.description = sanitizeHtml(description.trim());
    if (status) req.task.status = status;
    if (priority) req.task.priority = priority;

    const updatedTask = await req.task.save();
    res.json(updatedTask);
});

// @desc    Delete task
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