const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const project = await Project.create({
        name,
        description,
        user: req.user._id,
    });

    res.status(201).json(project);
});

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ user: req.user._id });
    res.json(projects);
});

// @desc    Get a single project
// @route   GET /api/projects/:projectId
// @access  Private
const getProjectById = asyncHandler (async (req, res) => {
    // Project already validated by authorizeProject middleware
    res.json(req.project);
});

// @desc    Update a project
// @route   PUT /api/projects/:projectId
// @access  Private
const updateProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    req.project.name = name || req.project.name;
    req.project.description = description || req.project.description;

    const updatedProject = await req.project.description;
    res.json(updatedProject);
});

// @desc    Delete a project
// @route   DELETE /api/projects/:projectId
// @access  Private
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