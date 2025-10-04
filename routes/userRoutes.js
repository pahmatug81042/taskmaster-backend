const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Apply rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests
    message: { message: "Too many login/register attempts. Please try again later." },
});

// Public routes
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);

module.exports = router;