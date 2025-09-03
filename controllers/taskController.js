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