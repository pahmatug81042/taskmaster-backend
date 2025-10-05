const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// ---------------------------
// Security Middleware Setup
// ---------------------------

// Helmet for secure HTTP headers
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

// CORS: restrict origins and allow credentials (cookies/JWT)
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// Parse cookies securely
app.use(cookieParser());

// Enforce JSON content for POST/PUT/PATCH/DELETE
app.use((req, res, next) => {
    if (
        req.method !== "GET" &&
        req.headers["content-type"] !== "application/json"
    ) {
        return res
            .status(415)
            .json({ message: "Content-Type must be application/json" });
    }
    next();
});

// Parse incoming JSON bodies
app.use(express.json());

// -----------------------------------------
// Prevent NoSQL Injection (Express 5 Safe)
// -----------------------------------------
app.use((req, res, next) => {
    try {
        // Sanitize mutable input sources only (req.body, params, headers)
        if (req.body) mongoSanitize.sanitize(req.body);
        if (req.params) mongoSanitize.sanitize(req.params);
        if (req.headers) mongoSanitize.sanitize(req.headers);
        // Skip req.query to avoid immutable error in Express 5
        next();
    } catch (err) {
        console.error("Mongo Sanitize Error:", err);
        next(err);
    }
});

// ----------------------------------
// Rate Limiting (Auth endpoints)
// ----------------------------------
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 login/register attempts
    message: "Too many login/register attempts. Please try again later.",
});
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

// ---------------------------
// API Routes
// ---------------------------
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/projects/:projectId/tasks", require("./routes/taskRoutes"));

// ---------------------------
// Error Handling Middleware
// ---------------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------------
// Server Initialization
// ---------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));