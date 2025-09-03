const Task = require('../../models/Task');
const Project = require('../../models/Project');

// Get all tasks under a project
const getTasks = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const tasks = await Task.find({ project: project._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getTasks;