const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// Security Headers with Helmet
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "script-src": ["'self'"],
                "object-src": ["'none'"],
                "upgrade-insecure-requests": [],
            },
        },
        crossOriginEmbedderPolicy: false,
    })
);

// CORS
app.use(
    cors({
        origin: "http://localhost:5173", // update for production
        credentials: true,
    })
);

// Body parser + enforce JSON Content-Type
app.use((req, res, next) => {
    if (req.method !== "GET" && req.headers["content-type"] !== "application/json") {
        return res.status(415).json({ message: "Content-Type must be application/json" });
    }
    next();
});
app.use(express.json());

// Prevent NoSQL injection
app.use(mongoSanitize());

// Rate limiters for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: "Too many login/register attempts. Please try again later.",
});
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/projects/:projectId/tasks", require("./routes/taskRoutes"));

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});