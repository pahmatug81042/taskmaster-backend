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

router.post('/', auth, createProject);
router.get('/', auth, getProjects);
router.get('/:id', auth, getProjectById);
router.put('/:id', auth, updateProject);