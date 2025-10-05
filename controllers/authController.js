const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const sanitizeHtml = require("sanitize-html");
require("dotenv").config();

/**
 * Generate JWT token (15-minute expiry)
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

/**
 * @desc    Register new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("Please provide username, email, and password");
    }

    username = sanitizeHtml(username.trim());
    email = email.trim().toLowerCase();

    if (!validator.isEmail(email)) {
        res.status(400);
        throw new Error("Invalid email format");
    }

    if (!validator.isLength(password, { min: 6 })) {
        res.status(400);
        throw new Error("Password must be at least 6 characters long");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists with this email");
    }

    const user = await User.create({ username, email, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

/**
 * @desc    Login user and set HttpOnly cookie
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide email and password");
    }

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);

        // Set secure cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            message: "Login successful",
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

/**
 * @desc    Logout user and clear cookie
 * @route   POST /api/users/logout
 * @access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
    res.json({ message: "Logged out successfully" });
});

module.exports = { registerUser, loginUser, logoutUser };