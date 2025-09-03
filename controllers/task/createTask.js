const Task = require('../../models/Task');
const Project = require('../../models/Project');

// @desc Create a task for a project
const createTask = async (req, res) => {
    const { projectId } = req.params; // <--- important
    const { title, description, status, dueDate } = req.body;

    try {
        // 1️⃣ Check if the project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // 2️⃣ Check if logged-in user owns the project
        if (project.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to access this project' });
        }

        // 3️⃣ Create the task
        const task = await Task.create({
            title,
            description,
            status,
            dueDate,
            project: projectId,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = createTask;