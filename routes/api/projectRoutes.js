const express = require('express');
const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
} = require('../../controllers/projectController');
const auth = require('../../middleware/authMiddleware');
const router = express.Router();