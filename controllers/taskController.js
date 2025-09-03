const Task = require('../models/Task');
const Project = require('../models/Project');

// Helper: Check if user owns the project
const checkProjectOwnership = async (projectId, userId) => {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');
    if (project.user.toString() !== userId.toString()) {
        throw new Error('Not authorized');
    }
    return project;
};

// @desc    Create a task under a project
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, status, dueDate } = req.body;

        // Verify ownership
        await checkProjectOwnership(projectId, req.user._id);

        const task = await Task.create({
            name,
            status,
            dueDate,
            project: projectId,
            user: req.user._id,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        // Verify ownership
        await checkProjectOwnership(projectId, req.user._id);

        const tasks = await Task.find({ project: projectId });
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};