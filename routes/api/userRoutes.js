const express = require('express');
const { registerUser, loginUser } = require('../../controllers/user/userController');
const router = express.Router();

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

module.exports = router;