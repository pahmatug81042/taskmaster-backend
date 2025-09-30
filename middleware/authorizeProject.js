const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");

/**
 * Middleware to check if the authenticated user owns the project.
 * Attaches the project document to req.project if authorized.
 */
const authorizeProject = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }

    // Check ownership
    if (project.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to access this project");
    }

    // Attach project to request object for downstream usage
    req.project = project;

    next();
});

module.exports = authorizeProject;