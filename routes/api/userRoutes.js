const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../../models/User');
const generateToken = require('../../utils/generateToken');

// POST /api/user/register
router.post(
    '/register',
    asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Create user
        const user = await User.create({ username, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    })
);

router.post('/login', (req, res) => {
    res.send('Login user');
});

module.exports = router;