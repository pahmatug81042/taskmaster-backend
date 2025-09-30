const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");
const Project = require("../models/Project");

// @desc    Create a new task under a project
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { title, description, status, priority } = req.body;

    // Verify ownership of project
    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    if (project.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to add tasks to this project");
    }

    const task = await Task.create({
        title,
        description,
        status,
        priority,
        project: projectId,
    });

    res.status(201).json(task);
});

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    // Verify ownership of project
    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    if (project.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to view tasks of this project");
    }

    const tasks = await Task.find({ project: projectId });
    res.json(tasks);
});

// @desc    Get single task by ID
// @route   GET /api/projects/:projectId/tasks/:taskId
// @access  Private
const getTaskById = asyncHandler (async (req, res) => {
    const { projectId, taskId } = req.params;

    // Verify ownership of project
    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    if (project.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to access tasks of this project");
    }

    const task = await Task.findOne({ _id: taskId, project: projectId });
    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }

    res.json(task);
});

// @desc    Update a task
// @route   PUT /api/projects/:projectId/tasks/:taskId
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
    const { projectId, taskId } = req.params;
    const { title, description, status, priority } = req.body;
    
    // Verify ownership of project
    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    if (project.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to update tasks of this project");
    }

    const task = await Task.findOne({ _id: taskId, project: projectId });
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
    const { projectId, taskId } = req.params;

    // Verify ownership of a project
    const project = await Project.findById(projectId);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    if (project.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete tasks of this project");
    }

    const task = await Task.findOne({ _id: taskId, project: projectId });
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