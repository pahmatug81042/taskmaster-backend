const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");
const { isMongoId } = require("validator");

/**
 * Middleware to check if the authenticated user owns the project.
 * Validates projectId format and attaches the project doc if authorized.
 */
const authorizeProject = asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    // Validate projectId format
    if (!projectId || !isMongoId(projectId)) {
        res.status(400);
        throw new Error("Invalid projectId format");
    }

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

    // Attach project to request object
    req.project = project;

    next();
});

module.exports = authorizeProject;