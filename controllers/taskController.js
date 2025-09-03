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

// @desc    Update a task
// @route   PUT /api/projects/:projectId/tasks/:taskId
// @access  Private
const updateTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;

        // Vreify ownership
        await checkProjectOwnership(projectId, req.user._id);

        let task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/projects/:projectId/tasks/:taskId
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const { projectId, taskId } = req.params;

        // Verify ownership
        await checkProjectOwnership(projectId, req.user._id);

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
};