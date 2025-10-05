const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
require("dotenv").config();

/**
 * Protect routes by verifying JWT in HttpOnly cookie
 */
const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.jwt;

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, token missing");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            res.status(401);
            throw new Error("User not found");
        }

        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, invalid token");
    }
});

/**
 * Authorize project ownership
 */
const authorizeProject = asyncHandler(async (req, res, next) => {
    const project = await Project.findById(req.params.id || req.params.projectId);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }
    if (project.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("User not authorized for this project");
    }
    req.project = project;
    next();
});

/**
 * Authorize task ownership via project
 */
const authorizeTask = asyncHandler(async (req, res, next) => {
    const task = await Task.findById(req.params.taskId).populate("project");
    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }
    if (task.project.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("User not authorized for this task");
    }
    req.task = task;
    next();
});

module.exports = { protect, authorizeProject, authorizeTask };