const express = require("express");
const rateLimit = require("express-rate-limit");
const {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
} = require("../controllers/authController");

const router = express.Router();

// Rate limit for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { message: "Too many login/register attempts. Please try again later." },
});

// Public routes
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);

// Authenticated routes
router.get("/me", getCurrentUser);
router.post("/logout", logoutUser);

module.exports = router;