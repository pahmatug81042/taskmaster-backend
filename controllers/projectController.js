const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");
const sanitizeHtml = require("sanitize-html");

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
    let { name, description } = req.body;

    if (!name) {
        res.status(400);
        throw new Error("Project name is required");
    }

    name = sanitizeHtml(name.trim());
    description = description ? sanitizeHtml(description.trim()) : "";

    const project = await Project.create({
        name,
        description,
        user: req.user._id,
    });

    res.status(201).json(project);
});

// @desc    Get all projects
// @route   GET /api/project
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ user: req.user._id });
    res.json(projects);
});

// @desc    Get a single project
const getProjectById = asyncHandler(async (req, res) => {
    res.json(req.project);
});

// @desc    Update project
const updateProject = asyncHandler(async (req, res) => {
    let { name, description } = req.body;

    if (name) req.project.name = sanitizeHtml(name.trim());
    if (description) req.project.description = sanitizeHtml(description.trim());

    const updatedProject = await req.project.save();
    res.json(updatedProject);
});

// @desc    Delete project
const deleteProject = asyncHandler(async (req, res) => {
    await req.project.deleteOne();
    res.json({ message: "Project removed successfully!" });
});

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
};