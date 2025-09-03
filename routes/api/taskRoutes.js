const express = require('express');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} = require('../../controllers/taskController');
const { protect } = require('../../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });