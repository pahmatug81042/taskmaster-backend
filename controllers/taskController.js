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
        project: req.project._id, // project already authorized by middleware
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
const getTaskById = asyncHandler(asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findOne({ _id: taskId, project: req.project._id });
    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }

    res.json(task);
}));

// @desc    Update a task
// @route   PUT /api/projects/:projectId/tasks/:taskId
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, priority } = req.body;

    const task = await Task.findOne({ _id: taskId, project: req.project._id });
    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;

    const updatedTask = await task.save();
    res.json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/projects/:projectId/tasks/:taskId
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findOne({ _id: taskId, project: req.project._id });
    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }

    await task.deleteOne();
    res.json({ message: "Task removed successfully!" });
});

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
};