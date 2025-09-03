const Project = require('../../models/Project');

// Get all projects for authenticated user
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getProjects;