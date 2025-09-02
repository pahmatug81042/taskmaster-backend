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