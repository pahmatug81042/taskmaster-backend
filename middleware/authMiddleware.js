const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("./models/User");
const Project = require("../models/Project");
const Task = require("../models/Task");
require("dotenv").config();

// Middleware to protect routes and attach user to req.user
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                res.status(401);
                throw new Error("User not found");
            }

            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token provided");
    }
});

// Middleware to check project ownership
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
    req.project = project; // attach project to request for controller
    next();
});

// Middleware to check task ownership via parent project
const authorizeTask = asyncHandler(async (req, res, next) => {
    const task = await Task.findById(req.params.taskId).populate("project");
    if (!task) {
        req.status(404);
        throw new Error("Task not found");
    }
    if (task.project.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("User not authorized for this task");
    }
    req.task = task; // attach task to request for controller
    next();
});

module.exports = { protect, authorizeProject, authorizeTask };