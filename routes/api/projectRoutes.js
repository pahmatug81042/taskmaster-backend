const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Project = require('../../models/Project');
const { protect } = require('../../middleware/authMiddleware');

// Create a new project (protected route)
router.post(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        const { name, description } = req.body;

        const project = await Project.create({
            name,
            description,
            user: req.user._id, // Assign owner from JWT
        });

        res.status(201).json(project);
    })
);

// Get all projects owned by the logged-in user
router.get(
    '/',
    protect,
    asyncHandler(async (req, res) => {
        const projects = await Project.find({ user: req.user._id });
        res.json(projects);
    })
);

// Get single project by ID with ownership check
router.get(
    '/:id',
    protect,
    asyncHandler(async (req, res) => {
        const project = await Project.findById(req.params.id);

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        if (project.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to access this project');
        }

        res.json(project);
    })
);