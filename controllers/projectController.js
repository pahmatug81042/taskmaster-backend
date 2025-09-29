const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const project = await Project.create({
        name,
        description,
        user: req.user._id, // ownership from auth middleware
    });

    res.status(201).json(project);
});

// @desc    Get all projects for logged-in user
// @route   Get /api/projects
// @access  Private
const getProjects = asyncHandler(async(req, res) => {
    const projects = await Project.find({ user: req.user._id });
    res.json(projects);
});

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private (ownership enforced)
const getProjectById = asyncHandler(async (req, res) => {
    const project = req.project; // set by authorizeProject middleware
    res.json(project);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (ownership enforced)
const updateProject = asyncHandler(async (req, res) => {
    const project = req.project; // set by authorizeProject middleware
    const { name, description } = req.body;

    project.name = name || project.name;
    project.description = description || project.description;

    const updatedProject = await project.save();
    res.json(updatedProject);
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (ownership enforced)
const deleteProject = asyncHandler(async (req, res) => {
    const project = req.project; // set by authorizeProject middleware
    await project.deleteOne();
    res.json({ message: "Project removed successfully!" });
});

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
};